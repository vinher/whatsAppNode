const fs = require('fs');
const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Función para obtener el ID del número de teléfono
async function getNumberId(client, phoneNumber) {
  const numberId = await client.getNumberId(phoneNumber);
  return numberId._serialized; // Devuelve el ID del número de teléfono
}

// Números de teléfono de destino
const phoneNumbers = [
  'numberphone', 'numberphone'
];

// Rutas de los archivos a enviar
const filesToBeSent = [
  { path: '/ruta/archivo/test.pdf',  caption: '\n Archivo PDF \n Enlace: https://es-la.facebook.com/' },
  /*{ path: '/ruta/archivo/test.png',  caption: 'Imagen PNG'    },
  { path: '/ruta/archivo/test.jpeg', caption: 'Imagen JPEG'   },
  { path: '/ruta/archivo/test.gif',  caption: 'Imagen GIF'    },
  { path: '/ruta/archivo/test.xlsx', caption: 'Archivo XSLS'  },
*/
];

// Crea un cliente de WhatsApp
const client = new Client();

// Cuando el cliente se autentica, muestra el código QR para escanear
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

// Cuando el cliente se autentica correctamente, muestra un mensaje
client.on('ready', async () => {
  console.log('Cliente autenticado');

  for (const phoneNumber of phoneNumbers) {
    // Obtener el ID del número de teléfono
    const numberId = await getNumberId(client, phoneNumber);

    // Enviar los archivos a los números de teléfono actuales
    for (const file of filesToBeSent) {
      try {
        const fileMedia = MessageMedia.fromFilePath(file.path);
        await client.sendMessage(numberId, fileMedia, { caption: file.caption });
        console.log(`Archivo enviado a ${phoneNumber} exitosamente: ${file.caption}`);
      } catch (error) {
        console.error(`Error al enviar el archivo a ${phoneNumber}:`, error);
      }
    }
  }

  // Cerrar el cliente después de enviar los mensajes a todos los números
  client.destroy();
});

// Iniciar sesión del cliente con una sesión previa si existe
const SESSION_FILE_PATH = '/home/Node/whatsAppNode/session.json';
if (fs.existsSync(SESSION_FILE_PATH)) {
  const sessionData = require(SESSION_FILE_PATH);
  client.options.session = sessionData;
  client.initialize(); 
}else{
  client.initialize();
}

// Manejar eventos de errores y desconecciones
client.on('disconnected', (reason) => {
  console.log('Cliente desconectado:', reason);
});

client.on('auth_failure', (error) => {
  console.error('Error de autenticación:', error);
});
