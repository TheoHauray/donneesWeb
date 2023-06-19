// Gabin GARROT, Théo HAURAY

function bouton1() {
  // Change la couleur de l'arrière-plan de la page en bleu
  document.body.style.backgroundColor = "blue";

  // Change la couleur des boutons en blanc
  var boutons = document.getElementsByTagName("input");
  for (var i = 0; i < boutons.length; i++) {
    boutons[i].style.color = "white";
  }
}

function bouton2() {
  // Rétablit la couleur de l'arrière-plan de la page par défaut
  document.body.style.backgroundColor = "";

  // Rétablit la couleur des boutons par défaut
  var boutons = document.getElementsByTagName("input");
  for (var i = 0; i < boutons.length; i++) {
    boutons[i].style.color = "";
  }
}

//Affiche le nom officiel du pays et la capitale dont le code est saisie.
function bouton3(codePays) {
  var xmlDocument = chargerHttpXML("../../countriesTP.xml");
  var countries = xmlDocument.getElementsByTagName("country");

  for (i = 0; i < countries.length; i++) {
    var code = countries[i].getElementsByTagName("cca2");

    if (code[0].innerHTML === codePays) {
      country_name =
        countries[i].getElementsByTagName("common_name")[0].innerHTML;
      the_capital = countries[i].getElementsByTagName("capital")[0].innerHTML;
      var concatPaysCapital =
        "<p> " + country_name + ", capitale : " + the_capital + "</p>";
      window.document.getElementById("result-find-country").innerHTML =
        concatPaysCapital;
      break; //On quitte la boucle pour éviter de faire des tests inutiles
    }
  }

  langues(codePays);
}

function afficheSVG(svgDocumentUrl) {
  //Document svgXML
  var svgDocument = chargerHttpXML(svgDocumentUrl);

  var svg = new XMLSerializer().serializeToString(svgDocument);

  //Element parent
  var elementHtmlParent = window.document.getElementById("resultats");
  elementHtmlParent.innerHTML = svg;
}

function afficheSVGCliquable(svgDocumentUrl, baliseAffichage) {
  afficheSVG(svgDocumentUrl);

  var elementHtmlParent = window.document.getElementById("resultats");
  var elementHtmlTextResult = window.document.getElementById("texte_resultats");
  var paths = elementHtmlParent.getElementsByTagName("g")[0].children;

  Array.from(paths).forEach(function (element) {
    element.addEventListener("click", function (event) {
      elementHtmlTextResult.innerHTML = element.getAttribute(baliseAffichage);
    });
  });
}

function showRandomCountry() {
  var xmlDocument = chargerHttpXML("../../countriesTP.xml");
  var countries = xmlDocument.getElementsByTagName("country");
  var resultCountryToGuess = document.getElementById("result_country_to_guess");
  resultCountryToGuess.textContent = "";

  // Sélectionne un pays aléatoire
  var randomIndex = Math.floor(Math.random() * countries.length);
  var country = countries[randomIndex];
  var countryName = country.getElementsByTagName("common_name")[0].innerHTML;

  // Affiche le nom du pays
  document.getElementById("country_to_guess").textContent = countryName;

  // Rend la carte cliquable
  makeWorldMapClickable();

  // Gère le clic sur la carte
  document.getElementById("svg-world-map").onclick = function (event) {
    var clickedCountry = event.target.getAttribute("id");
    var countryCode = country.getElementsByTagName("cca2")[0].innerHTML;

    // Vérifie si le pays cliqué correspond au pays aléatoire
    var result = clickedCountry === countryCode;

    // Affiche le résultat
    resultCountryToGuess.textContent = result ? "True" : "False";

    if (result == true) {
      resultCountryToGuess.style.color = "green";
    } else {
      resultCountryToGuess.style.color = "red";
    }
  };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function recupererPremierEnfantDeTypeElement(n) {
  var x = n.firstChild;
  while (x.nodeType != 1) {
    // Test if x is an element node (and not a text node or other)
    x = x.nextSibling;
  }
  return x;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//change le contenu de l'�lement avec l'id "nom" avec la chaine de caract�res en param�tre
function setNom(nom) {
  var elementHtmlARemplir =
    window.document.getElementById("id_nom_a_remplacer");
  elementHtmlARemplir.innerHTML = nom;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Charge le fichier JSON se trouvant � l'URL donn�e en param�tre et le retourne
function chargerHttpJSON(jsonDocumentUrl) {
  var httpAjax;

  httpAjax = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");

  if (httpAjax.overrideMimeType) {
    httpAjax.overrideMimeType("text/xml");
  }

  // chargement du fichier JSON � l'aide de XMLHttpRequest synchrone (le 3� param�tre est d�fini � false)
  httpAjax.open("GET", jsonDocumentUrl, false);
  httpAjax.send();

  var responseData = eval("(" + httpAjax.responseText + ")");

  return responseData;
}

function chargerHttpXML(xmlDocumentUrl) {
  var httpAjax;

  httpAjax = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");

  if (httpAjax.overrideMimeType) {
    httpAjax.overrideMimeType("text/xml");
  }

  //chargement du fichier XML à l'aide de XMLHttpRequest synchrone (le 3e parametre est défini à false)
  httpAjax.open("GET", xmlDocumentUrl, false);
  httpAjax.send();

  return httpAjax.responseXML;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Bouton2_ajaxEmployees(xmlDocumentUrl) {
  var xmlDocument = chargerHttpXML(xmlDocumentUrl);

  //extraction des noms � partir du document XML (avec une feuille de style ou en javascript)
  var lesNoms = xmlDocument.getElementsByTagName("LastName");

  // Parcours de la liste des noms avec une boucle for et
  // construction d'une chaine de charact�res contenant les noms s�par�s par des espaces
  // Pour avoir la longueur d'une liste : attribut 'length'
  // Acc�s au texte d'un noeud "LastName" : NOM_NOEUD.firstChild.nodeValue
  var chaineDesNoms = "";
  for (i = 0; i < lesNoms.length; i++) {
    if (i > 0) {
      chaineDesNoms = chaineDesNoms + ", ";
    }
    chaineDesNoms = chaineDesNoms + lesNoms[i].firstChild.nodeValue + " ";
  }

  // Appel (ou recopie) de la fonction setNom(...) ou bien autre fa�on de modifier le texte de l'�l�ment "span"
  setNom(chaineDesNoms);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Bouton3_ajaxBibliographie(
  xmlDocumentUrl,
  xslDocumentUrl,
  baliseElementARecuperer
) {
  // Chargement du fichier XSL � l'aide de XMLHttpRequest synchrone
  var xslDocument = chargerHttpXML(xslDocumentUrl);

  //cr�ation d'un processuer XSL
  var xsltProcessor = new XSLTProcessor();

  // Importation du .xsl
  xsltProcessor.importStylesheet(xslDocument);

  // Chargement du fichier XML � l'aide de XMLHttpRequest synchrone
  var xmlDocument = chargerHttpXML(xmlDocumentUrl);

  // Cr�ation du document XML transform� par le XSL
  var newXmlDocument = xsltProcessor.transformToDocument(xmlDocument);

  // Recherche du parent (dont l'id est "here") de l'�l�ment � remplacer dans le document HTML courant
  var elementHtmlParent = window.document.getElementById(
    "id_element_a_remplacer"
  );

  // ins�rer l'�lement transform� dans la page html
  elementHtmlParent.innerHTML = newXmlDocument.getElementsByTagName(
    baliseElementARecuperer
  )[0].innerHTML;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Bouton4_ajaxBibliographieAvecParametres(
  xmlDocumentUrl,
  xslDocumentUrl,
  baliseElementARecuperer,
  paramXSL_type_reference
) {
  // Chargement du fichier XSL � l'aide de XMLHttpRequest synchrone
  var xslDocument = chargerHttpXML(xslDocumentUrl);

  //cr�ation d'un processuer XSL
  var xsltProcessor = new XSLTProcessor();

  // Importation du .xsl
  xsltProcessor.importStylesheet(xslDocument);

  //passage du param�tre � la feuille de style
  xsltProcessor.setParameter("", "param_ref_type", paramXSL_type_reference);

  // Chargement du fichier XML � l'aide de XMLHttpRequest synchrone
  var xmlDocument = chargerHttpXML(xmlDocumentUrl);

  // Cr�ation du document XML transform� par le XSL
  var newXmlDocument = xsltProcessor.transformToDocument(xmlDocument);

  // Recherche du parent (dont l'id est "here") de l'�l�ment � remplacer dans le document HTML courant
  var elementHtmlParent = window.document.getElementById(
    "id_element_a_remplacer"
  );

  // ins�rer l'�lement transform� dans la page html
  elementHtmlParent.innerHTML = newXmlDocument.getElementsByTagName(
    baliseElementARecuperer
  )[0].innerHTML;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Bouton4_ajaxEmployeesTableau(xmlDocumentUrl, xslDocumentUrl) {
  //commenter la ligne suivante qui affiche la bo�te de dialogue!
  alert("Fonction � compl�ter...");
}

function recupererPremierEnfantDeTypeNode(n) {
  var x = n.firstChild;
  while (x.nodeType != 1) {
    // Test if x is an element node (and not a text node or other)
    x = x.nextSibling;
  }
  return x;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function printWorldMap() {
  var elemnt = document.getElementById("world-map");
  // Get the reference to the SVG element
  const svgElement = document.getElementById("svg-world-map");

  // Fetch the SVG file
  fetch("worldHigh.svg")
    .then((response) => response.text())
    .then((svgContent) => {
      // Set the SVG content as the inner HTML of the SVG element
      svgElement.innerHTML = svgContent;
    })
    .catch((error) => {
      console.error("Error loading SVG file:", error);
    });
}

function makeWorldMapClickable() {
  // Get the reference to the SVG element
  const svgElement = document.getElementById("svg-world-map");
  const countries = svgElement.getElementsByTagName("path"); // Replace 'rect' with the desired tag name
  const countryName = document.getElementById("countryName");

  for (var i = 0; i < countries.length; i++) {
    console.log(countries[i]);
    countries[i].addEventListener("click", (element) => {
      console.log(element.target.getAttribute("countryname"));
      countryName.innerHTML = element.target.getAttribute("countryname");
    });
  }
}

function hoverCountries() {
  // Get the reference to the SVG element
  const svgElement = document.getElementById("svg-world-map");
  const countries = svgElement.getElementsByTagName("path"); // Replace 'rect' with the desired tag name

  for (var i = 0; i < countries.length; i++) {
    countries[i].addEventListener("mouseover", (element) => {
      var idPays = element.target.id;
      element.target.style.fill = "red";

      //   Create the table and populate it
      populateCountryTable(element.target.id);

      //   Get the monnaie and populate column
      fetch("https://restcountries.com/v2/alpha/" + idPays.toLowerCase())
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          window.document.getElementById("monnaie").innerHTML =
            data.currencies[0].name;
        });
    });

    countries[i].addEventListener("mouseout", (element) => {
      element.target.style.fill = "grey";
    });
  }
}

function populateCountryTable(id) {
  console.log(id);
  // Chargement du fichier XSL � l'aide de XMLHttpRequest synchrone
  var xslDocument = chargerHttpXML("affichePays.xsl");

  //cr�ation d'un processuer XSL
  var xsltProcessor = new XSLTProcessor();

  // Importation du .xsl
  xsltProcessor.importStylesheet(xslDocument);

  //passage du param�tre � la feuille de style
  xsltProcessor.setParameter("", "cca2", id);

  // Chargement du fichier XML � l'aide de XMLHttpRequest synchrone
  var xmlDocument = chargerHttpXML("../../countriesTP.xml");

  console.log(xmlDocument);

  // Cr�ation du document XML transform� par le XSL
  var newXmlDocument = xsltProcessor.transformToDocument(xmlDocument);

  // Recherche du parent (dont l'id est "here") de l'�l�ment � remplacer dans le document HTML courant
  var elementHtmlParent = window.document.getElementById("table-country-desc");

  var serializer = new XMLSerializer();
  var str = serializer.serializeToString(newXmlDocument);

  // ins�rer l'�lement transform� dans la page html
  elementHtmlParent.innerHTML = str;
}

function populateDataList() {
  var xmlDocument = chargerHttpXML("../../countriesTP.xml");
  var cca2s = xmlDocument.getElementsByTagName("cca2");
  var datalistHtml = ``;

  var cca2Input = document.getElementById("cca2_input");
  var datalistElement = document.getElementById("cca2_list");

  for (i = 0; i < cca2s.length; i++) {
    if (cca2s[i].innerHTML.includes(cca2Input.value.toUpperCase())) {
      datalistHtml += `<option value="${cca2s[i].innerHTML}"</option>`;
    }
  }
  datalistElement.innerHTML = datalistHtml;
}

//Affiche les pays dont la/les langue(s) parlée(s) est/sont la/les même(s) que le pays sélectionné.
function langues(codePays) {
  //Document XML
  var xmlDocument = chargerHttpXML("../../countriesTP.xml");

  //Langues du pays sélectionné
  var pathLanguages =
    "//country[country_codes/cca2 ='" + codePays + "' ]/languages";
  var langues = xmlDocument
    .evaluate(pathLanguages, xmlDocument, null, XPathResult.ANY_TYPE, null)
    .iterateNext().children;
  var languesPays = [];
  for (i = 0; i < langues.length; i++) {
    languesPays.push(langues[i].innerHTML);
  }
  console.log("resultat_nom", languesPays);

  var pathCountries = "//countries";
  var countries = xmlDocument
    .evaluate(pathCountries, xmlDocument, null, XPathResult.ANY_TYPE, null)
    .iterateNext().children;

  var paysMemeLangue = [];

  Array.from(countries).forEach((country) => {
    balisesLanguages = country.getElementsByTagName("languages");
    if (balisesLanguages.length > 0) {
      var tempLang = [];
      Array.from(balisesLanguages[0].children).forEach((langueN) => {
        tempLang.push(langueN.innerHTML);
      });

      //intersection des 2 tableaux
      if (languesPays.filter((x) => tempLang.includes(x)).length > 0) {
        paysMemeLangue.push(country.getElementsByTagName("cca2")[0].innerHTML);
      }
    }
  });

  var elementHtmlParent = window.document.getElementById("svg-world-map");
  var paths = elementHtmlParent.getElementsByTagName("g")[0].children;

  Array.from(paths).forEach(function (element) {
    if (paysMemeLangue.includes(element.getAttribute("id"))) {
      element.style.fill = "green";
    }
  });
}
