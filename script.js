async function checkTemperature() {
    const fileInput = document.getElementById('csvFile');
    const resultDiv = document.getElementById('result');
    const tbody = document.querySelector("#tempTable tbody");
    tbody.innerHTML = "";

    if (!fileInput.files.length) {
        Swal.fire('Error', 'Please upload a CSV file!', 'error');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async function(e) {
        const text = e.target.result;
        const rows = text.split("\n").slice(1);
        const phoneNumber = "919398295385"; 

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!row) continue;
            const [timestamp, tempStr] = row.split(",");
            const temp = parseFloat(tempStr);

            
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${timestamp}</td><td>${temp}</td>`;
            if (temp > 28) {
                tr.classList.add("high-temp");
            }
            tbody.appendChild(tr);

            
            if (!isNaN(temp) && temp > 28) {
                const message = `⚠️ Temperature Alert!\nTime: ${timestamp}\nTemperature: ${temp}°C\n PLEASE OPEN THE WINDOWS`;

                const result = await Swal.fire({
                    title: 'High Temperature Detected!',
                    html: `<pre>${message}</pre>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Send WhatsApp',
                    cancelButtonText: 'Skip',
                    background: '#ffffff',
                    color: '#0d6efd'
                });

                if (result.isConfirmed) {
                    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappLink, "_blank");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        resultDiv.textContent = "All high-temperature alerts have been processed.";
    };

    reader.readAsText(file);
}
