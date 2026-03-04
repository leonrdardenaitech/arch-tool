async function generateBrandVision() {
    const idea = document.getElementById('brand-idea').value;
    const why = document.getElementById('brand-why').value;

    if (!idea || !why) {
        alert("Please fill in both fields to activate Agent 007.");
        return;
    }

    // Phase Switch: Input -> Carousel
    document.getElementById('input-section').style.display = 'none';
    document.getElementById('carousel-section').style.display = 'block';
    document.getElementById('display-brand-name').innerText = idea;

    try {
        // Parallel Processing
        const [imageRes, reportRes] = await Promise.all([
            fetch('/api/generate-images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea })
            }),
            fetch('/api/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea, why })
            })
        ]);

        const imageData = await imageRes.json();
        const reportData = await reportRes.json();

        if (imageData.error || reportData.error) {
            throw new Error(imageData.error || reportData.error);
        }

        // Start the 15-second visual journey
        runCarousel(imageData.urls, reportData.report);

    } catch (err) {
        console.error("Critical Failure:", err);
        alert("Nexus Link Broken: " + err.message);
        location.reload();
    }
}

function runCarousel(urls, reportHtml) {
    const imgElement = document.getElementById('carousel-image');
    const labelElement = document.getElementById('carousel-label');
    const labels = ["Billboard Visualization", "Newspaper Advertisement", "Social Media Feed"];
    
    let currentIndex = 0;
    imgElement.src = urls[currentIndex];
    labelElement.innerText = labels[currentIndex];

    const interval = setInterval(() => {
        currentIndex++;
        if (currentIndex < urls.length) {
            imgElement.style.opacity = 0;
            setTimeout(() => {
                imgElement.src = urls[currentIndex];
                labelElement.innerText = labels[currentIndex];
                imgElement.style.opacity = 1;
            }, 500);
        } else {
            clearInterval(interval);
            revealEmailReport(urls[1], reportHtml); // Index 1 is the newspaper image
        }
    }, 5000);
}

function revealEmailReport(newspaperUrl, reportHtml) {
    document.getElementById('carousel-section').style.display = 'none';
    document.getElementById('email-attachment').src = newspaperUrl;
    document.getElementById('ai-report-body').innerHTML = reportHtml;
    document.getElementById('email-report-section').style.display = 'block';
}

function downloadReport() {
    const element = document.getElementById('report-content-to-print');
    const brandName = document.getElementById('brand-idea').value || 'Brand';
    
    const opt = {
        margin:       0.5,
        filename:     `${brandName.replace(/\s+/g, '_')}_Intelligence_Report_007.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}
