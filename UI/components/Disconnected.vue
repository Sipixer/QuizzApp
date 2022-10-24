<template>
    <div>
        <h1>Erreur de connexion</h1>
        <h2>En cours de reconnexion</h2>
        <div class="loader"></div>
    </div>
</template>

<style>
.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}</style>