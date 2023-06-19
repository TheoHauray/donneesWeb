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
function bouton3_1(codePays) {
  var nomPays = "Le code saisie ne correspond à aucun pays."; // Si le code n'existe pas

  var xmlDocument = chargerHttpXML("../../countriesTP.xml");
  var countries = xmlDocument.getElementsByTagName("country");

  for (i = 0; i < countries.length; i++) {
    var code = countries[i].getElementsByTagName("cca2");

    if (code[0].innerHTML === codePays) {
      country_name =
        countries[i].getElementsByTagName("common_name")[0].innerHTML;
      the_capital = countries[i].getElementsByTagName("capital")[0].innerHTML;
      var concatPaysCapital =
        "<p> Pays : " + country_name + ", capitale : " + the_capital + "</p>";
      window.document.getElementById("result-find-country").innerHTML =
        concatPaysCapital;
      break; //On quitte la boucle pour éviter de faire des tests inutiles
    }
  }
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
//charge le fichier XML se trouvant � l'URL relative donn� dans le param�treet le retourne
function chargerHttpXML(xmlDocumentUrl) {
  var httpAjax;

  httpAjax = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");

  if (httpAjax.overrideMimeType) {
    httpAjax.overrideMimeType("text/xml");
  }

  //chargement du fichier XML � l'aide de XMLHttpRequest synchrone (le 3� param�tre est d�fini � false)
  httpAjax.open("GET", xmlDocumentUrl, false);
  httpAjax.send();

  return httpAjax.responseXML;
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

  for (var i = 0; i < countries.length; i++) {
    countries[i].addEventListener("mouseover", (element) => {
      element.target.style.fill = "red";
    });
    countries[i].addEventListener("mouseout", (element) => {
      element.target.style.fill = "grey";
    });
  }
}
