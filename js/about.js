
  // Menü öffnen
function openMenu() {
  document.getElementById("overlay-menu").style.display = "flex";
}

// Menü schließen
function closeMenu() {
  document.getElementById("overlay-menu").style.display = "none";
}

// Altersberechnung ab Geburtsdatum
function calculateAge(birthDateStr) {
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}

// Sobald DOM geladen ist, Alter in das HTML schreiben
document.addEventListener("DOMContentLoaded", () => {
  const age = calculateAge("1990-11-04");
  const ageSpan = document.getElementById("age");
  if (ageSpan) {
    ageSpan.textContent = age;
  }
});