// Structure de données pour stocker les informations du CV
let cvData = {
    personalInfo: {
        name: "",
        email: "",
        linkedin: "",
        github: "",
        photoUrl: ""
    },
    experiences: [],
    technologies: []
};

// Fonction pour ajouter une nouvelle expérience professionnelle
function addExperience(data = {}) {
    const experiencesDiv = document.getElementById('experiences');
    const index = experiencesDiv.querySelectorAll('.experience').length;
    const experienceHtml = `
        <div class="experience">
            <input type="text" id="exp-title-${index}" placeholder="Titre du poste" value="${data.title || ''}">
            <input type="text" id="exp-company-${index}" placeholder="Entreprise" value="${data.company || ''}">
            <input type="text" id="exp-dates-${index}" placeholder="Dates" value="${data.dates || ''}">
            <textarea id="exp-description-${index}" placeholder="Description">${data.description || ''}</textarea>
        </div>
    `;
    experiencesDiv.insertAdjacentHTML('beforeend', experienceHtml);
}

// Fonction pour ajouter une nouvelle technologie
function addTechnology(data = {}) {
    const technologiesDiv = document.getElementById('technologies');
    const index = technologiesDiv.querySelectorAll('.technology').length;
    const technologyHtml = `
        <div class="technology">
            <input type="text" id="tech-name-${index}" placeholder="Nom de la technologie" value="${data.name || ''}">
            <input type="text" id="tech-level-${index}" placeholder="Niveau (optionnel)" value="${data.level || ''}">
        </div>
    `;
    technologiesDiv.insertAdjacentHTML('beforeend', technologyHtml);
}

// Fonction pour sauvegarder les données du CV
function saveData() {
    cvData.personalInfo = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        linkedin: document.getElementById('linkedin').value,
        github: document.getElementById('github').value,
        photoUrl: document.getElementById('photo-url').value
    };

    const experienceDivs = document.querySelectorAll('.experience');
    cvData.experiences = Array.from(experienceDivs).map((exp, index) => ({
        title: document.getElementById(`exp-title-${index}`).value,
        company: document.getElementById(`exp-company-${index}`).value,
        dates: document.getElementById(`exp-dates-${index}`).value,
        description: document.getElementById(`exp-description-${index}`).value
    }));

    const technologyDivs = document.querySelectorAll('.technology');
    cvData.technologies = Array.from(technologyDivs).map((tech, index) => ({
        name: document.getElementById(`tech-name-${index}`).value,
        level: document.getElementById(`tech-level-${index}`).value
    }));

    localStorage.setItem('cvData', JSON.stringify(cvData));
    updatePreview();
    updateCheckboxes();
}

// Fonction pour exporter les données au format JSON
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

// Gestionnaire d'événement pour l'importation de fichier JSON
document.getElementById('import-json').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        cvData = JSON.parse(e.target.result);
        localStorage.setItem('cvData', JSON.stringify(cvData));
        loadData();
        updatePreview();
        updateCheckboxes();
    };
    reader.readAsText(file);
});

// Fonction pour charger les données sauvegardées
function loadData() {
    const savedData = localStorage.getItem('cvData');
    if (savedData) {
        cvData = JSON.parse(savedData);

        document.getElementById('name').value = cvData.personalInfo.name || '';
        document.getElementById('email').value = cvData.personalInfo.email || '';
        document.getElementById('linkedin').value = cvData.personalInfo.linkedin || '';
        document.getElementById('github').value = cvData.personalInfo.github || '';
        document.getElementById('photo-url').value = cvData.personalInfo.photoUrl || '';

        document.getElementById('experiences').innerHTML = '';
        cvData.experiences.forEach((expData) => {
            addExperience(expData);
        });

        document.getElementById('technologies').innerHTML = '';
        cvData.technologies.forEach((techData) => {
            addTechnology(techData);
        });
    }
}

// Fonction pour mettre à jour les cases à cocher
function updateCheckboxes() {
    const expCheckboxes = document.getElementById('experience-checkboxes');
    const techCheckboxes = document.getElementById('technology-checkboxes');

    expCheckboxes.innerHTML = cvData.experiences.map((exp, index) => 
        `<label><input type="checkbox" class="exp-checkbox" data-index="${index}" checked> ${exp.title || 'Expérience ' + (index + 1)}</label><br>`
    ).join('');

    techCheckboxes.innerHTML = cvData.technologies.map((tech, index) =>
        `<label><input type="checkbox" class="tech-checkbox" data-index="${index}" checked> ${tech.name || 'Technologie ' + (index + 1)}</label><br>`
    ).join('');

    document.querySelectorAll('.exp-checkbox, .tech-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updatePreview);
    });
}

// Fonction pour mettre à jour la prévisualisation du CV
function updatePreview() {
    const preview = document.getElementById('cv-preview');
    const selectedExps = Array.from(document.querySelectorAll('.exp-checkbox:checked')).map(cb => parseInt(cb.dataset.index));
    const selectedTechs = Array.from(document.querySelectorAll('.tech-checkbox:checked')).map(cb => parseInt(cb.dataset.index));

    const info = cvData.personalInfo;
    let previewHtml = `
        <h2>${info.name}</h2>
        <p>Email: ${info.email}</p>
        <p>LinkedIn: <a href="${info.linkedin}" target="_blank">${info.linkedin}</a></p>
        <p>GitHub: <a href="${info.github}" target="_blank">${info.github}</a></p>
        <img id="photo" src="${info.photoUrl}" alt="Photo de profil">
        
        <h3>Expériences professionnelles</h3>
    `;

    selectedExps.forEach(index => {
        const exp = cvData.experiences[index];
        previewHtml += `
            <div class="experience">
                <h4>${exp.title} - ${exp.company}</h4>
                <p>${exp.dates}</p>
                <p>${exp.description}</p>
            </div>
        `;
    });

    previewHtml += '<h3>Technologies</h3><ul>';
    selectedTechs.forEach(index => {
        const tech = cvData.technologies[index];
        previewHtml += `<li>${tech.name}${tech.level ? ` - ${tech.level}` : ''}</li>`;
    });
    previewHtml += '</ul>';

    preview.innerHTML = previewHtml;
}

// Fonction pour générer le PDF du CV
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    html2canvas(document.getElementById('cv-preview')).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        doc.save('cv.pdf');
    });
}

// DEBUT CODE DEV
// Fonction pour charger les données de test
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
        updateCheckboxes();
    } catch (e) {
        console.error('Erreur lors de la récupération des données de test :', e);
    }
}
// FIN CODE DEV

// Chargement initial des données et mise à jour de l'interface
loadData();
updatePreview();
updateCheckboxes();

