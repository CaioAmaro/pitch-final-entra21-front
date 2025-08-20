const editBtn = document.getElementById('editBtn');
        const saveBtn = document.getElementById('saveBtn');
        const form = document.getElementById('userForm');
        const inputs = form.querySelectorAll('input');

        editBtn.onclick = function() {
            inputs.forEach(input => input.disabled = false);
            saveBtn.disabled = false;
            editBtn.disabled = true;
        };

        form.onsubmit = function(e) {
            e.preventDefault();
            inputs.forEach(input => input.disabled = true);
            saveBtn.disabled = true;
            editBtn.disabled = false;
            alert('Dados salvos!');
        };