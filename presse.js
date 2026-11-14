/* Page presse : l'adresse du contact presse n'est jamais écrite en clair dans le HTML.
   Sans script, la page montre « stillapp.contact [at] gmail.com ». Avec le script, un bouton l'assemble au clic
   et la remplace par un lien mailto, suivi d'un bouton « Copier l'adresse » si le presse-papiers est permis. */
(function () {
  "use strict";
  var bloc = document.querySelector("[data-contact]");
  if (!bloc) return;
  var repli = bloc.querySelector("[data-repli]");
  var bouton = bloc.querySelector("[data-afficher]");
  var annonce = document.querySelector("[data-annonce]");
  if (!repli || !bouton) return;

  function adresse() {
    return ["stillapp", "contact"].join(".") + String.fromCharCode(64) + ["gmail", "com"].join(".");
  }
  function dire(texte) {
    if (!annonce) return;
    annonce.textContent = "";
    window.setTimeout(function () { annonce.textContent = texte; }, 60);
  }

  repli.hidden = true;
  bouton.hidden = false;

  bouton.addEventListener("click", function () {
    var a = adresse();
    var lien = document.createElement("a");
    lien.className = "contact__adresse";
    lien.href = "mailto:" + a;
    lien.textContent = a;
    bloc.replaceChild(lien, bouton);
    bloc.removeChild(repli);

    if (navigator.clipboard && window.isSecureContext) {
      var copier = document.createElement("button");
      copier.type = "button";
      copier.className = "bouton-contour";
      copier.textContent = "Copier l’adresse";
      copier.addEventListener("click", function () {
        navigator.clipboard.writeText(a).then(function () {
          copier.textContent = "Adresse copiée";
          dire("Adresse copiée.");
          window.setTimeout(function () { copier.textContent = "Copier l’adresse"; }, 2400);
        }, function () {
          dire("La copie n’a pas fonctionné : sélectionne l’adresse.");
        });
      });
      bloc.appendChild(copier);
    }
    lien.focus();
  });
})();
