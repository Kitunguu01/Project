/* =====================================================
   MEDICARE HOSPITAL MANAGEMENT SYSTEM
   FRONTEND ONLY
   Data is stored in browser localStorage.
   No backend / API connection.
===================================================== */


/* ================= DATA ================= */

let patients = JSON.parse(localStorage.getItem("hospital_patients")) || [];

let doctors = JSON.parse(localStorage.getItem("hospital_doctors")) || [];

let departments = JSON.parse(localStorage.getItem("hospital_departments")) || [];

let appointments = JSON.parse(localStorage.getItem("hospital_appointments")) || [];


/* ================= SAVE DATA ================= */

function saveData() {

    localStorage.setItem(
        "hospital_patients",
        JSON.stringify(patients)
    );

    localStorage.setItem(
        "hospital_doctors",
        JSON.stringify(doctors)
    );

    localStorage.setItem(
        "hospital_departments",
        JSON.stringify(departments)
    );

    localStorage.setItem(
        "hospital_appointments",
        JSON.stringify(appointments)
    );
}


/* ================= HELPERS ================= */

function generateId(prefix) {

    return prefix + Date.now() + Math.floor(Math.random() * 1000);
}


function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getInitials(firstName, lastName) {

    return (
        (firstName?.charAt(0) || "") +
        (lastName?.charAt(0) || "")
    ).toUpperCase();
}


function formatDate(date) {

    if (!date) {
        return "-";
    }

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
        return date;
    }

    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* ================= NAVIGATION ================= */

function toggleSidebar() {

    document.getElementById("sidebar")
        .classList.toggle("open");
}


function showPage(pageId, button) {

    document.querySelectorAll(".page")
        .forEach(page => page.classList.remove("active-page"));

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active-page");
    }


    document.querySelectorAll(".nav-item")
        .forEach(item => item.classList.remove("active"));

    if (button) {
        button.classList.add("active");
    }


    const titles = {
        dashboard: "Dashboard",
        patients: "Patients",
        appointments: "Appointments",
        doctors: "Doctors",
        departments: "Departments"
    };

    document.getElementById("pageTitle").textContent =
        titles[pageId] || "Hospital";


    if (window.innerWidth <= 800) {
        document.getElementById("sidebar")
            .classList.remove("open");
    }


    if (pageId === "dashboard") {
        updateDashboard();
    }

    if (pageId === "patients") {
        renderPatients();
    }

    if (pageId === "appointments") {
        renderAppointments();
    }

    if (pageId === "doctors") {
        renderDoctors();
    }

    if (pageId === "departments") {
        renderDepartments();
    }
}


/* ================= DATE ================= */

function displayCurrentDate() {

    const element = document.getElementById("currentDate");

    const today = new Date();

    element.textContent = today.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* ================= MODALS ================= */

function openModal(id) {

    document.getElementById(id)
        .classList.add("show");
}


function closeModal(id) {

    document.getElementById(id)
        .classList.remove("show");
}


function openPatientModal() {

    document.getElementById("patientForm").reset();

    openModal("patientModal");
}


function closePatientModal() {

    closeModal("patientModal");
}


function openAppointmentModal() {

    populateAppointmentSelects();

    document.getElementById("appointmentForm").reset();

    populateAppointmentSelects();

    openModal("appointmentModal");
}


function closeAppointmentModal() {

    closeModal("appointmentModal");
}


function openDoctorModal() {

    document.getElementById("doctorForm").reset();

    populateDepartmentSelects();

    openModal("doctorModal");
}


function closeDoctorModal() {

    closeModal("doctorModal");
}


function openDepartmentModal() {

    document.getElementById("departmentForm").reset();

    openModal("departmentModal");
}


function closeDepartmentModal() {

    closeModal("departmentModal");
}


/* ================= PATIENTS ================= */

function submitPatientForm(event) {

    event.preventDefault();


    const patient = {

        id: generateId("P"),

        firstName:
            document.getElementById("patientFirstName").value.trim(),

        lastName:
            document.getElementById("patientLastName").value.trim(),

        gender:
            document.getElementById("patientGender").value,

        dateOfBirth:
            document.getElementById("patientDOB").value,

        phone:
            document.getElementById("patientPhone").value.trim(),

        email:
            document.getElementById("patientEmail").value.trim(),

        bloodGroup:
            document.getElementById("patientBlood").value,

        address:
            document.getElementById("patientAddress").value.trim(),

        emergencyContact:
            document.getElementById("emergencyContact").value.trim(),

        emergencyPhone:
            document.getElementById("emergencyPhone").value.trim(),

        createdAt:
            new Date().toISOString()
    };


    patients.unshift(patient);

    saveData();

    closePatientModal();

    renderPatients();

    updateDashboard();

    showToast("Patient added successfully.");
}


function renderPatients(list = patients) {

    const table = document.getElementById("patientsTable");

    if (!table) {
        return;
    }


    if (list.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">
                        <div class="empty-state-icon">♙</div>
                        <h3>No patients found</h3>
                        <p>Add a patient to see them here.</p>
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML = list.map(patient => `

        <tr>

            <td>
                <span class="muted">
                    ${escapeHTML(patient.id)}
                </span>
            </td>

            <td>
                <div class="patient-name">
                    ${escapeHTML(patient.firstName)}
                    ${escapeHTML(patient.lastName)}
                </div>
            </td>

            <td>
                ${escapeHTML(patient.gender)}
            </td>

            <td>
                ${escapeHTML(patient.phone)}
            </td>

            <td>
                ${escapeHTML(patient.bloodGroup || "-")}
            </td>

            <td>
                ${escapeHTML(patient.email || "-")}
            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="small-btn delete-btn"
                        onclick="deletePatient('${patient.id}')">
                        Delete
                    </button>

                </div>

            </td>

        </tr>

    `).join("");
}


function searchPatients() {

    const query =
        document.getElementById("patientSearch")
        .value
        .toLowerCase()
        .trim();


    const filtered = patients.filter(patient => {

        const fullName =
            `${patient.firstName} ${patient.lastName}`
            .toLowerCase();

        return (
            fullName.includes(query) ||
            patient.phone.toLowerCase().includes(query) ||
            (patient.email || "").toLowerCase().includes(query)
        );
    });


    renderPatients(filtered);
}


function deletePatient(id) {

    const confirmed =
        confirm("Are you sure you want to delete this patient?");

    if (!confirmed) {
        return;
    }


    patients = patients.filter(
        patient => patient.id !== id
    );


    saveData();

    renderPatients();

    updateDashboard();

    showToast("Patient deleted.");
}


/* ================= DOCTORS ================= */

function submitDoctorForm(event) {

    event.preventDefault();


    const doctor = {

        id: generateId("D"),

        firstName:
            document.getElementById("doctorFirstName").value.trim(),

        lastName:
            document.getElementById("doctorLastName").value.trim(),

        specialization:
            document.getElementById("doctorSpecialization").value,

        department:
            document.getElementById("doctorDepartment").value,

        phone:
            document.getElementById("doctorPhone").value.trim(),

        email:
            document.getElementById("doctorEmail").value.trim(),

        createdAt:
            new Date().toISOString()
    };


    doctors.unshift(doctor);

    saveData();

    closeDoctorModal();

    renderDoctors();

    updateDashboard();

    showToast("Doctor added successfully.");
}


function renderDoctors(list = doctors) {

    const grid = document.getElementById("doctorGrid");

    if (!grid) {
        return;
    }


    if (list.length === 0) {

        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚕</div>
                <h3>No doctors registered</h3>
                <p>Add a doctor to see them here.</p>
            </div>
        `;

        return;
    }


    grid.innerHTML = list.map(doctor => `

        <div class="doctor-card">

            <div class="doctor-top">

                <div class="doctor-avatar">
                    ${escapeHTML(
                        getInitials(
                            doctor.firstName,
                            doctor.lastName
                        )
                    )}
                </div>

                <div>

                    <h3>
                        Dr. ${escapeHTML(doctor.firstName)}
                        ${escapeHTML(doctor.lastName)}
                    </h3>

                    <div class="doctor-specialization">
                        ${escapeHTML(doctor.specialization)}
                    </div>

                </div>

            </div>


            <div class="doctor-details">

                <p>
                    🏥
                    ${escapeHTML(
                        doctor.department || "No department"
                    )}
                </p>

                <p>
                    ☎
                    ${escapeHTML(doctor.phone)}
                </p>

                <p>
                    ✉
                    ${escapeHTML(doctor.email || "-")}
                </p>

            </div>


            <div class="doctor-actions">

                <button
                    class="small-btn delete-btn"
                    onclick="deleteDoctor('${doctor.id}')">
                    Delete
                </button>

            </div>

        </div>

    `).join("");
}


function deleteDoctor(id) {

    const confirmed =
        confirm("Are you sure you want to delete this doctor?");

    if (!confirmed) {
        return;
    }


    doctors = doctors.filter(
        doctor => doctor.id !== id
    );


    saveData();

    renderDoctors();

    updateDashboard();

    showToast("Doctor deleted.");
}


/* ================= DEPARTMENTS ================= */

function submitDepartmentForm(event) {

    event.preventDefault();


    const department = {

        id: generateId("DEP"),

        name:
            document.getElementById("departmentName")
            .value
            .trim(),

        description:
            document.getElementById("departmentDescription")
            .value
            .trim(),

        createdAt:
            new Date().toISOString()
    };


    departments.unshift(department);

    saveData();

    closeDepartmentModal();

    renderDepartments();

    updateDashboard();

    showToast("Department added successfully.");
}


function renderDepartments(list = departments) {

    const grid = document.getElementById("departmentGrid");

    if (!grid) {
        return;
    }


    if (list.length === 0) {

        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">▣</div>
                <h3>No departments</h3>
                <p>Add a department to see it here.</p>
            </div>
        `;

        return;
    }


    grid.innerHTML = list.map(department => `

        <div class="department-card">

            <div class="department-icon">
                🏥
            </div>

            <h3>
                ${escapeHTML(department.name)}
            </h3>

            <p>
                ${escapeHTML(
                    department.description ||
                    "No description provided."
                )}
            </p>


            <div class="department-actions">

                <button
                    class="small-btn delete-btn"
                    onclick="deleteDepartment('${department.id}')">
                    Delete
                </button>

            </div>

        </div>

    `).join("");
}


function deleteDepartment(id) {

    const confirmed =
        confirm("Are you sure you want to delete this department?");

    if (!confirmed) {
        return;
    }


    departments = departments.filter(
        department => department.id !== id
    );


    saveData();

    renderDepartments();

    populateDepartmentSelects();

    updateDashboard();

    showToast("Department deleted.");
}


/* ================= SELECTS ================= */

function populateDepartmentSelects() {

    const doctorDepartment =
        document.getElementById("doctorDepartment");

    const appointmentDepartment =
        document.getElementById("appointmentDepartment");


    const options = departments.map(department => `

        <option value="${escapeHTML(department.name)}">
            ${escapeHTML(department.name)}
        </option>

    `).join("");


    if (doctorDepartment) {

        doctorDepartment.innerHTML = `
            <option value="">Select Department</option>
            ${options}
        `;
    }


    if (appointmentDepartment) {

        appointmentDepartment.innerHTML = `
            <option value="">Select Department</option>
            ${options}
        `;
    }
}


function populateAppointmentSelects() {

    const patientSelect =
        document.getElementById("appointmentPatient");

    const doctorSelect =
        document.getElementById("appointmentDoctor");


    if (patientSelect) {

        patientSelect.innerHTML = `
            <option value="">Select Patient</option>

            ${patients.map(patient => `

                <option value="${patient.id}">

                    ${escapeHTML(patient.firstName)}
                    ${escapeHTML(patient.lastName)}

                </option>

            `).join("")}
        `;
    }


    if (doctorSelect) {

        doctorSelect.innerHTML = `
            <option value="">Select Doctor</option>

            ${doctors.map(doctor => `

                <option value="${doctor.id}">

                    Dr. ${escapeHTML(doctor.firstName)}
                    ${escapeHTML(doctor.lastName)}

                </option>

            `).join("")}
        `;
    }


    populateDepartmentSelects();
}


/* ================= APPOINTMENTS ================= */

function submitAppointmentForm(event) {

    event.preventDefault();


    const appointment = {

        id: generateId("A"),

        patientId:
            document.getElementById("appointmentPatient").value,

        doctorId:
            document.getElementById("appointmentDoctor").value,

        department:
            document.getElementById("appointmentDepartment").value,

        date:
            document.getElementById("appointmentDate").value,

        time:
            document.getElementById("appointmentTime").value,

        reason:
            document.getElementById("appointmentReason").value.trim(),

        status: "Pending",

        createdAt:
            new Date().toISOString()
    };


    appointments.unshift(appointment);

    saveData();

    closeAppointmentModal();

    renderAppointments();

    updateDashboard();

    showToast("Appointment created successfully.");
}


function getPatientName(id) {

    const patient = patients.find(
        p => p.id === id
    );

    if (!patient) {
        return "Unknown Patient";
    }

    return `${patient.firstName} ${patient.lastName}`;
}


function getDoctorName(id) {

    const doctor = doctors.find(
        d => d.id === id
    );

    if (!doctor) {
        return "Unknown Doctor";
    }

    return `Dr. ${doctor.firstName} ${doctor.lastName}`;
}


function renderAppointments(list = appointments) {

    const table =
        document.getElementById("appointmentsTable");


    if (!table) {
        return;
    }


    if (list.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">

                    <div class="empty-state">

                        <div class="empty-state-icon">
                            ◷
                        </div>

                        <h3>No appointments</h3>

                        <p>
                            Create an appointment to see it here.
                        </p>

                    </div>

                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML = list.map(appointment => {

        const statusClass =
            appointment.status.toLowerCase();

        return `

            <tr>

                <td class="patient-name">
                    ${escapeHTML(
                        getPatientName(
                            appointment.patientId
                        )
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        getDoctorName(
                            appointment.doctorId
                        )
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        appointment.department
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        formatDate(
                            appointment.date
                        )
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        appointment.time
                    )}
                </td>

                <td>

                    <select
                        class="status-select"
                        onchange="changeAppointmentStatus(
                            '${appointment.id}',
                            this.value
                        )">

                        <option
                            value="Pending"
                            ${appointment.status === "Pending" ? "selected" : ""}>
                            Pending
                        </option>

                        <option
                            value="Confirmed"
                            ${appointment.status === "Confirmed" ? "selected" : ""}>
                            Confirmed
                        </option>

                        <option
                            value="Completed"
                            ${appointment.status === "Completed" ? "selected" : ""}>
                            Completed
                        </option>

                        <option
                            value="Cancelled"
                            ${appointment.status === "Cancelled" ? "selected" : ""}>
                            Cancelled
                        </option>

                    </select>

                </td>

                <td>

                    <button
                        class="small-btn delete-btn"
                        onclick="deleteAppointment('${appointment.id}')">
                        Delete
                    </button>

                </td>

            </tr>

        `;

    }).join("");
}


function changeAppointmentStatus(id, status) {

    const appointment =
        appointments.find(
            appointment => appointment.id === id
        );


    if (!appointment) {
        return;
    }


    appointment.status = status;

    saveData();

    renderAppointments();

    showToast("Appointment status updated.");
}


function filterAppointments() {

    const query =
        document.getElementById("appointmentSearch")
        .value
        .toLowerCase()
        .trim();


    const filtered =
        appointments.filter(appointment => {

            const patient =
                getPatientName(
                    appointment.patientId
                ).toLowerCase();

            const doctor =
                getDoctorName(
                    appointment.doctorId
                ).toLowerCase();

            const department =
                (appointment.department || "")
                .toLowerCase();

            return (
                patient.includes(query) ||
                doctor.includes(query) ||
                department.includes(query) ||
                appointment.status
                    .toLowerCase()
                    .includes(query)
            );
        });


    renderAppointments(filtered);
}


function deleteAppointment(id) {

    const confirmed =
        confirm("Are you sure you want to delete this appointment?");

    if (!confirmed) {
        return;
    }


    appointments = appointments.filter(
        appointment => appointment.id !== id
    );


    saveData();

    renderAppointments();

    updateDashboard();

    showToast("Appointment deleted.");
}


/* ================= DASHBOARD ================= */

function updateDashboard() {

    document.getElementById("totalPatients")
        .textContent = patients.length;

    document.getElementById("totalAppointments")
        .textContent = appointments.length;

    document.getElementById("totalDoctors")
        .textContent = doctors.length;

    document.getElementById("totalDepartments")
        .textContent = departments.length;


    renderRecentPatients();
}


function renderRecentPatients() {

    const table =
        document.getElementById("recentPatients");


    if (!table) {
        return;
    }


    const recent =
        patients.slice(0, 5);


    if (recent.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">

                    <div class="empty-state">

                        <div class="empty-state-icon">
                            ♙
                        </div>

                        <h3>No patients yet</h3>

                        <p>
                            Registered patients will appear here.
                        </p>

                    </div>

                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML = recent.map(patient => `

        <tr>

            <td class="patient-name">

                ${escapeHTML(patient.firstName)}
                ${escapeHTML(patient.lastName)}

            </td>

            <td>
                ${escapeHTML(patient.gender)}
            </td>

            <td>
                ${escapeHTML(patient.phone)}
            </td>

            <td>
                ${escapeHTML(
                    patient.bloodGroup || "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    formatDate(patient.createdAt)
                )}
            </td>

        </tr>

    `).join("");
}


/* ================= FORM EVENTS ================= */

function setupForms() {

    document
        .getElementById("patientForm")
        .addEventListener(
            "submit",
            submitPatientForm
        );


    document
        .getElementById("doctorForm")
        .addEventListener(
            "submit",
            submitDoctorForm
        );


    document
        .getElementById("departmentForm")
        .addEventListener(
            "submit",
            submitDepartmentForm
        );


    document
        .getElementById("appointmentForm")
        .addEventListener(
            "submit",
            submitAppointmentForm
        );
}


/* ================= CLOSE MODAL ================= */

document.addEventListener(
    "click",
    function(event) {

        if (event.target.classList.contains("modal")) {

            event.target.classList.remove("show");

        }

    }
);


document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            document
                .querySelectorAll(".modal.show")
                .forEach(modal => {
                    modal.classList.remove("show");
                });

        }

    }
);


/* ================= START ================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayCurrentDate();

        setupForms();

        updateDashboard();

        renderPatients();

        renderDoctors();

        renderDepartments();

        renderAppointments();

        populateDepartmentSelects();

    }
);