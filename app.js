const express = require('express');
const app = express();
const port = 3000;

// Permitir que Express sirva archivos estáticos desde el directorio 'public'
app.use(express.static('public'));

// Checklist en memoria
let checklist = [];

app.use(express.json());

// Página principal
app.get('/', (req, res) => {
  let itemsHtml = checklist.map((item, index) => `<li>${item} <button onclick="removeItem(${index})">Eliminar</button></li>`).join('');
  res.send(`
    <html>
      <head>
        <link rel="stylesheet" type="text/css" href="styles.css">
        <script>
          async function addItem() {
            const item = document.getElementById('newItem').value;
            const res = await fetch('/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ item })
            });
            if (res.ok) {
              window.location.reload();
            }
          }

          async function removeItem(index) {
            const res = await fetch('/remove', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ index })
            });
            if (res.ok) {
              window.location.reload();
            }
          }
        </script>
      </head>
      <body>
        <h1>Checklist de Alimentos</h1>
        <input type="text" id="newItem" />
        <button onclick="addItem()">Añadir</button>
        <ul>
          ${itemsHtml}
        </ul>
      </body>
    </html>
  `);
});

// Añadir elemento al checklist
app.post('/add', (req, res) => {
  const { item } = req.body;
  checklist.push(item);
  res.sendStatus(200);
});

// Eliminar elemento del checklist
app.post('/remove', (req, res) => {
  const { index } = req.body;
  checklist.splice(index, 1);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
