const firebaseConfig = {
    apiKey: "AIzaSyCdLZzsBYIYHfpcaz4VZ1wZPCoJaKO4dFk",
    authDomain: "prjcacalima.firebaseapp.com",
    projectId: "prjcacalima",
    storageBucket: "prjcacalima.firebasestorage.app",
    messagingSenderId: "287408042727",
    appId: "1:287408042727:web:11119caa715f4630ece842",
    measurementId: "G-7E79BGNNHG"
};

// 1. Inicializa o Firebase (Apenas uma vez)
// Verifica se já não foi inicializado para evitar erros
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 2. Inicializa o Auth (Login)
const auth = firebase.auth();

// 3. Inicializa o Firestore (Banco de Dados)
const db = firebase.firestore();

// REMOVIDO: const storage = firebase.storage(); 
// (Isso estava travando seu site porque não usamos mais a biblioteca do Storage)