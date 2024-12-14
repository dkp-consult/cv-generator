// Données du CV
let cvData = {
    personalInfo: {
        name: "",
        email: "",
        gsm: "",
        linkedin: "",
        github: "",
        photoUrl: ""
    },
    experiences: [],
    technologies: []
};

// Ajoute une expérience (extrait modifié pour la gestion du clic sur la card)
function addExperience(data = {}) {
    const experiencesDiv = document.getElementById('experiences');
    const index = experiencesDiv.querySelectorAll('.experience-card').length;

    const experienceHtml = `
        <div class="experience-card">
            <div class="checkbox-container">
                <input type="checkbox" id="exp-checkbox-${index}" class="exp-checkbox" data-index="${index}" checked>
            </div>

            <label for="exp-title-${index}">Titre du poste</label>
            <input type="text" id="exp-title-${index}" placeholder="Titre du poste" value="${data.title || ''}">

            <label for="exp-company-${index}">Entreprise</label>
            <input type="text" id="exp-company-${index}" placeholder="Entreprise" value="${data.company || ''}">

            <label for="exp-dates-${index}">Dates</label>
            <input type="text" id="exp-dates-${index}" placeholder="Dates" value="${data.dates || ''}">

            <label for="exp-description-${index}">Description</label>
            <textarea id="exp-description-${index}" placeholder="Description">${data.description || ''}</textarea>
        </div>
    `;
    experiencesDiv.insertAdjacentHTML('beforeend', experienceHtml);

    const card = experiencesDiv.lastElementChild; // la dernière carte ajoutée
    const checkbox = card.querySelector('.exp-checkbox');

    // Empêcher la propagation sur la checkbox
    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Empêcher la propagation sur les champs de saisie
    const fields = card.querySelectorAll('input[type="text"], input[type="url"], input[type="email"], textarea');
    fields.forEach(field => {
        field.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Clic sur la carte -> toggle la checkbox
    card.addEventListener('click', () => {
        checkbox.checked = !checkbox.checked;
        updatePreview();
    });

    // Mise à jour preview si on change la checkbox
    checkbox.addEventListener('change', updatePreview);
}

function addTechnology(data = {}) {
    const technologiesDiv = document.getElementById('technologies');
    const index = technologiesDiv.querySelectorAll('.technology-card').length;

    const technologyHtml = `
        <div class="technology-card">
            <div class="checkbox-container">
                <input type="checkbox" id="tech-checkbox-${index}" class="tech-checkbox" data-index="${index}" checked>
            </div>

            <label for="tech-name-${index}">Nom de la technologie</label>
            <input type="text" id="tech-name-${index}" placeholder="Technologie" value="${data.name || ''}">

            <label for="tech-level-${index}">Niveau (optionnel)</label>
            <input type="text" id="tech-level-${index}" placeholder="Niveau" value="${data.level || ''}">
        </div>
    `;
    technologiesDiv.insertAdjacentHTML('beforeend', technologyHtml);

    const card = technologiesDiv.lastElementChild; // la dernière carte ajoutée
    const checkbox = card.querySelector('.tech-checkbox');

    // Empêcher la propagation sur la checkbox
    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Empêcher la propagation sur les champs de saisie
    const fields = card.querySelectorAll('input[type="text"], input[type="url"], input[type="email"], textarea');
    fields.forEach(field => {
        field.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Clic sur la carte -> toggle la checkbox
    card.addEventListener('click', () => {
        checkbox.checked = !checkbox.checked;
        updatePreview();
    });

    // Mise à jour preview si on change la checkbox
    checkbox.addEventListener('change', updatePreview);
}

// Sauvegarde des données
function saveData() {
    cvData.personalInfo = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        gsm: document.getElementById('gsm').value,
        linkedin: document.getElementById('linkedin').value,
        github: document.getElementById('github').value,
        photoUrl: document.getElementById('photo-url').value
    };

    const experienceDivs = document.querySelectorAll('.experience-card');
    cvData.experiences = Array.from(experienceDivs).map((exp, index) => ({
        title: document.getElementById(`exp-title-${index}`).value,
        company: document.getElementById(`exp-company-${index}`).value,
        dates: document.getElementById(`exp-dates-${index}`).value,
        description: document.getElementById(`exp-description-${index}`).value,
        included: document.getElementById(`exp-checkbox-${index}`).checked
    }));

    const technologyDivs = document.querySelectorAll('.technology-card');
    cvData.technologies = Array.from(technologyDivs).map((tech, index) => ({
        name: document.getElementById(`tech-name-${index}`).value,
        level: document.getElementById(`tech-level-${index}`).value,
        included: document.getElementById(`tech-checkbox-${index}`).checked
    }));

    localStorage.setItem('cvData', JSON.stringify(cvData));
    updatePreview();
}

// Export JSON
function exportJSON() {
    saveData();
    const blob = new Blob([JSON.stringify(cvData, null, 2)], {type : 'application/json'});
    const url = URL.createObjectURL(blob);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.href = url;
    downloadAnchorNode.setAttribute("download", "cv_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    document.body.removeChild(downloadAnchorNode);
    URL.revokeObjectURL(url);
}

// Import JSON
document.getElementById('import-json').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        cvData = JSON.parse(e.target.result);
        localStorage.setItem('cvData', JSON.stringify(cvData));
        loadData();
        updatePreview();
    };
    reader.readAsText(file);
});

// Chargement des données
function loadData() {
    const savedData = localStorage.getItem('cvData');
    if (savedData) {
        cvData = JSON.parse(savedData);

        document.getElementById('name').value = cvData.personalInfo.name || '';
        document.getElementById('email').value = cvData.personalInfo.email || '';
        document.getElementById('gsm').value = cvData.personalInfo.gsm || '';
        document.getElementById('linkedin').value = cvData.personalInfo.linkedin || '';
        document.getElementById('github').value = cvData.personalInfo.github || '';
        document.getElementById('photo-url').value = cvData.personalInfo.photoUrl || '';

        document.getElementById('experiences').innerHTML = '';
        cvData.experiences.forEach((expData, index) => {
            addExperience(expData);
            document.getElementById(`exp-checkbox-${index}`).checked = expData.included;
        });

        document.getElementById('technologies').innerHTML = '';
        cvData.technologies.forEach((techData, index) => {
            addTechnology(techData);
            document.getElementById(`tech-checkbox-${index}`).checked = techData.included;
        });
    }
}

// Mise à jour de la prévisualisation
function updatePreview() {
    const preview = document.getElementById('cv-preview');
    const info = cvData.personalInfo;
    let previewHtml = `
        <div class="cv-header">
            <div class="cv-header-left">
                <img id="photo" src="${info.photoUrl}" alt="Photo de profil">
                <h2>${info.name}</h2>
            </div>
            <div class="cv-header-right">
                <p><strong>Email:</strong> ${info.email}</p>
                <p><strong>GSM:</strong> ${info.gsm}</p>
                <p><strong>LinkedIn:</strong> <a href="${info.linkedin}" target="_blank">${info.linkedin}</a></p>
                <p><strong>GitHub:</strong> <a href="${info.github}" target="_blank">${info.github}</a></p>
            </div>
        </div>
        
        <h3>Expériences professionnelles</h3>
    `;

    cvData.experiences.forEach((exp, index) => {
        if (document.getElementById(`exp-checkbox-${index}`).checked) {
            previewHtml += `
                <div class="experience-item">
                    <h4>${exp.title} - ${exp.company}</h4>
                    <p class="experience-dates"><em>${exp.dates}</em></p>
                    <p class="experience-description">${exp.description}</p>
                </div>
            `;
        }
    });

    previewHtml += '<h3>Technologies</h3><div class="technologies-grid">';
    cvData.technologies.forEach((tech, index) => {
        if (document.getElementById(`tech-checkbox-${index}`).checked) {
            previewHtml += `<div class="technology-item"><strong>${tech.name} : </strong>${tech.level ? `<span class="technology-level">${tech.level}</span>` : ''}</div>`;
        }
    });
    previewHtml += '</div>';

    preview.innerHTML = previewHtml;
}

// Génération du PDF (html2pdf)
async function generatePDF() {
    const element = document.getElementById('cv-preview');
    const opt = {
        margin:       10,       
        filename:     'cv.pdf',
        image:        { type: 'png', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
}

// Chargement des données de test (dev)
async function loadSampleData() {
    try {
        const response = await fetch('sample_data.json');
        if (!response.ok) {
            console.error('Erreur lors du chargement du fichier sample_data.json');
            return;
        }
        const data = await response.json();
        localStorage.setItem('cvData', JSON.stringify(data));
        loadData();
        updatePreview();
    } catch (e) {
        console.error('Erreur lors de la récupération des données de test :', e);
    }
}

// Live preview
function setupLivePreview() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            saveData();
            updatePreview();
        });
    });
}

// Initialisation
loadData();
updatePreview();
setupLivePreview();