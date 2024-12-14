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
        <input type="checkbox" id="exp-checkbox-${index}" class="exp-checkbox" data-index="${index}" checked>
            <div class="checkbox-container">
                <input type="text" id="exp-title-${index}" placeholder="Titre du poste" value="${data.title || ''}">
            </div>
            <input type="text" id="exp-company-${index}" placeholder="Entreprise" value="${data.company || ''}">
            <input type="text" id="exp-dates-${index}" placeholder="Dates" value="${data.dates || ''}">
            <textarea id="exp-description-${index}" placeholder="Description">${data.description || ''}</textarea>
        </div>
    `;
    experiencesDiv.insertAdjacentHTML('beforeend', experienceHtml);
    document.getElementById(`exp-checkbox-${index}`).addEventListener('change', updatePreview);
}

// Fonction pour ajouter une nouvelle technologie
function addTechnology(data = {}) {
    const technologiesDiv = document.getElementById('technologies');
    const index = technologiesDiv.querySelectorAll('.technology').length;
    const technologyHtml = `
        <div class="technology">
        <input type="checkbox" id="tech-checkbox-${index}" class="tech-checkbox" data-index="${index}" checked>
            <div class="checkbox-container">
                <input type="text" id="tech-name-${index}" placeholder="Nom de la technologie" value="${data.name || ''}">
            </div>
            <input type="text" id="tech-level-${index}" placeholder="Niveau (optionnel)" value="${data.level || ''}">
        </div>
    `;
    technologiesDiv.insertAdjacentHTML('beforeend', technologyHtml);
    document.getElementById(`tech-checkbox-${index}`).addEventListener('change', updatePreview);
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
        description: document.getElementById(`exp-description-${index}`).value,
        included: document.getElementById(`exp-checkbox-${index}`).checked
    }));

    const technologyDivs = document.querySelectorAll('.technology');
    cvData.technologies = Array.from(technologyDivs).map((tech, index) => ({
        name: document.getElementById(`tech-name-${index}`).value,
        level: document.getElementById(`tech-level-${index}`).value,
        included: document.getElementById(`tech-checkbox-${index}`).checked
    }));

    localStorage.setItem('cvData', JSON.stringify(cvData));
    updatePreview();
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

// Fonction pour mettre à jour la prévisualisation du CV
function updatePreview() {
    const preview = document.getElementById('cv-preview');
    const info = cvData.personalInfo;
    let previewHtml = `
        <div class="cv-header">
            <img id="photo" src="${info.photoUrl}" alt="Photo de profil">
            <div class="cv-header-content">
                <h2>${info.name}</h2>
                <p><strong>Email:</strong> ${info.email}</p>
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
            previewHtml += `<div class="technology-item"><strong>${tech.name}</strong>${tech.level ? `<span class="technology-level">${tech.level}</span>` : ''}</div>`;
        }
    });
    previewHtml += '</div>';

    preview.innerHTML = previewHtml;
}

// Fonction pour générer le PDF du CV
async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const preview = document.getElementById('cv-preview');

    // Fonction pour charger l'image
    const loadImage = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    };

    try {
        // Attendre que l'image soit chargée
        const photoUrl = preview.querySelector('#photo').src;
        await loadImage(photoUrl);

        // Créer le PDF
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();

        // Capturer le contenu HTML
        const canvas = await html2canvas(preview, { useCORS: true, scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        // Calculer la hauteur proportionnelle
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / pdfWidth;
        const pdfHeight = imgHeight / ratio;

        // Ajouter l'image au PDF
        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        // Ajouter des pages supplémentaires si nécessaire
        while (heightLeft >= 0) {
            position = heightLeft - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
        }

        // Sauvegarder le PDF
        pdf.save('cv.pdf');
    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
    }
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
    } catch (e) {
        console.error('Erreur lors de la récupération des données de test :', e);
    }
}
// FIN CODE DEV

// Fonction pour mettre à jour dynamiquement la prévisualisation lors de la saisie
function setupLivePreview() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            saveData();
            updatePreview();
        });
    });
}

// Chargement initial des données et mise à jour de l'interface
loadData();
updatePreview();
setupLivePreview();

