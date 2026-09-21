/* =========================
   NAVIGATION FUNCTIONS
========================= */

function scrollToProjects() {

    document
        .getElementById("projects")
        .scrollIntoView({
            behavior: "smooth"
        });

}


function scrollToPostProject() {

    document
        .getElementById("post-project")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================
   LOGIN
========================= */

function loginUser() {

    alert(
        "Login feature will be connected to the backend."
    );

}


/* =========================
   APPLY FOR PROJECT
========================= */

function applyProject(projectName) {

    alert(
        "Application submitted successfully!\n\n" +
        "Project: " + projectName
    );

}


/* =========================
   VIEW FREELANCER PROFILE
========================= */

function viewProfile(name) {

    alert(
        "Opening freelancer profile:\n\n" +
        name
    );

}


/* =========================
   SEARCH PROJECTS
========================= */

function searchProjects() {

    let searchInput =
        document
        .getElementById("searchProject")
        .value
        .toLowerCase();

    let projects =
        document.querySelectorAll(
            ".project-card"
        );


    projects.forEach(function(project) {

        let projectText =
            project.textContent.toLowerCase();


        if (projectText.includes(searchInput)) {

            project.style.display = "block";

        } else {

            project.style.display = "none";

        }

    });

}


/* =========================
   POST NEW PROJECT
========================= */

document
    .getElementById("projectForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            let title =
                document
                .getElementById("projectTitle")
                .value;


            let description =
                document
                .getElementById("projectDescription")
                .value;


            let skills =
                document
                .getElementById("projectSkills")
                .value;


            let budget =
                document
                .getElementById("projectBudget")
                .value;


            /* Create project card */

            let projectCard =
                document.createElement("div");

            projectCard.classList.add(
                "project-card"
            );


            projectCard.innerHTML = `

                <h3>${title}</h3>

                <p>
                    ${description}
                </p>

                <p>
                    <strong>Skills:</strong>
                    ${skills}
                </p>

                <p class="budget">
                    Budget: ₹${budget}
                </p>

                <button onclick="applyProject('${title}')">
                    Apply Now
                </button>

            `;


            /* Add project to page */

            document
                .getElementById("project-list")
                .appendChild(projectCard);


            /* Success message */

            alert(
                "Project posted successfully!"
            );


            /* Clear form */

            document
                .getElementById("projectForm")
                .reset();


            /* Scroll to projects */

            document
                .getElementById("projects")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );