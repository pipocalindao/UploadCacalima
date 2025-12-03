      

      
      const firebaseConfig = {
    apiKey: "AIzaSyCdLZzsBYIYHfpcaz4VZ1wZPCoJaKO4dFk",
    authDomain: "prjcacalima.firebaseapp.com",
    projectId: "prjcacalima",
    storageBucket: "prjcacalima.firebasestorage.app",
    messagingSenderId: "287408042727",
    appId: "1:287408042727:web:11119caa715f4630ece842",
    measurementId: "G-7E79BGNNHG"
  };
  firebase.initializeApp(firebaseConfig);

  // 1. Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// 2. Inicializa o Auth (Login)
const auth = firebase.auth();

// 3. Inicializa o Firestore (Banco de Dados)
const db = firebase.firestore();

// 4. Inicializa o Storage (Arquivos)
const storage = firebase.storage()
