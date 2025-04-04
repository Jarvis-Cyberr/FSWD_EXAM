document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Initialize scanner when switching to scan tab
            if (tabId === 'scan') {
                initScanner();
            }
        });
    });
    
    // QR Code Generator
    const qrText = document.getElementById('qr-text');
    const generateBtn = document.getElementById('generate-btn');
    const qrcodeContainer = document.getElementById('qrcode');
    const downloadBtn = document.getElementById('download-btn');
    
    let qrCode;
    
    generateBtn.addEventListener('click', function() {
        const text = qrText.value.trim();
        
        if (text === '') {
            alert('Please enter some text or URL');
            return;
        }
        
        // Clear previous QR code
        qrcodeContainer.innerHTML = '';
        
        // Generate new QR code
        qrCode = new QRCode(qrcodeContainer, {
            text: text,
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // Enable download button
        downloadBtn.disabled = false;
    });
    
    downloadBtn.addEventListener('click', function() {
        if (!qrCode) return;
        
        // Get the QR code image
        const imgSrc = qrcodeContainer.querySelector('img').src;
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = imgSrc;
        link.download = 'qrcode.png';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    // QR Code Scanner
    let html5QrcodeScanner;
    
    function initScanner() {
        if (html5QrcodeScanner) {
            return; // Scanner already initialized
        }
        
        html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );
        
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    }
    
    function onScanSuccess(decodedText, decodedResult) {
        // Handle the scanned code
        document.getElementById('result').textContent = decodedText;
        
        // Optional: Play a beep sound
        const beep = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU");
        beep.play();
    }
    
    function onScanFailure(error) {
        // Handle scan failure, usually better to ignore and keep scanning.
        console.warn(`QR code scanning failed: ${error}`);
    }
});