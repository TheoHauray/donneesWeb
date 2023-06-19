partieJavascript.js
//TP 3IFA Partie Ajax
//Louise PIETROPAOLI, Alexandre MARTIN (B3005)


function bouton1() {
    //efface précédents resultats
    effaceResultat()
    document.body.style.backgroundColor = "cyan";
    document.getElementById("mybouton1").style.color = "white";
}

function bouton2() {
    //efface précédents resultats
    effaceResultat()
    document.body.style.backgroundColor = "initial";
    document.getElementById("mybouton1").style.color = "initial";
}

//Affiche le nom officiel du pays et la capitale dont le code dont le code est sélectionné dans le champ de saisie.
function bouton3_1(codePays) {
    //efface précédents resultats
    effaceResultat()

    var nomPays = "Aucun pays trouvé avec ce code."; //si aucun pays ne correspond au codePays passé en paramètres

    var xmlDocument = chargerHttpXML("../countriesTP.xml");
    var countries = xmlDocument.getElementsByTagName("country");

    for (i = 0; i < countries.length; i++) {
        var code = countries[i].getElementsByTagName("cca2");

        if (code[0].innerHTML == codePays) {
            country_name = countries[i].getElementsByTagName("country_name");
            nomPays = "Pays : " + recupererPremierEnfantDeTypeNode(country_name[0]).innerHTML;

            the_capital = countries[i].getElementsByTagName("the_capital")[0].innerHTML;
            nomPays += "<br>Capitale : " + the_capital;
            break;//On quitte la boucle pour éviter de faire des tests inutiles
        }
    }
    window.document.getElementById("texte_resultats").innerHTML = nomPays;
}


//affichage grâce au template XSL. codePays indique le code du pays dont on souhaite extraire des données
//xslDocumentUrl pointe sur la bonne feuille XSL. Nous avons cherchePays pour les premières questions,
//et cherchePaysInfos pour la version évoluée avec l'indice de gini, la population, le nom de domaine principal...
function affichagePaysDrapeau(codePays, xslDocumentUrl) {
    var xmlDocumentUrl = "../countriesTP.xml";

    //XSL Document
    var xslDocument = chargerHttpXML(xslDocumentUrl);

    //Creation d'un processeur XSL
    var xsltProcessor = new XSLTProcessor();

    //Import du .xsl
    xsltProcessor.importStylesheet(xslDocument);

    //Passage du parametre a la feuille de style
    xsltProcessor.setParameter("", "code", codePays);

    // Chargement du fichier XML à l'aide de XMLHttpRequest synchrone 
    var xmlDocument = chargerHttpXML(xmlDocumentUrl);

    // Cr�ation du document XML transformé par le XSL
    var newXmlDocument = xsltProcessor.transformToDocument(xmlDocument);

    return newXmlDocument.getElementsByTagName("element_a_recuperer")[0].innerHTML;
}

//Affiche le nom officiel et la capitale du pays dont le code est sélectionné dans le champ de saisie. (utilisation de XSL)
function bouton3_2(codePays) {
    //efface précédents resultats
    effaceResultat();
    langues(codePays);

    // Recherche du parent
    var elementHtmlParent = window.document.getElementById("texte_resultats");

    // insérer l'élement transformé dans la page html
    elementHtmlParent.innerHTML = affichagePaysDrapeau(codePays, "cherchePays.xsl");

}

//Réponse à la question 5 : charge et afiche le dessin svg contenu dans le fichier : exemple.svg. 
function afficheSVG(svgDocumentUrl) {
    //efface précédents resultats
    effaceResultat()

    //Document svgXML
    var svgDocument = chargerHttpXML(svgDocumentUrl);

    var svg = new XMLSerializer().serializeToString(svgDocument);

    //Element parent
    var elementHtmlParent = window.document.getElementById("resultats");
    elementHtmlParent.innerHTML = svg;
}

//Réponse à la question 6 : rend les éléments SVG Cliquables
function afficheSVGCliquable(svgDocumentUrl, baliseAffichage) {

    afficheSVG(svgDocumentUrl);

    var elementHtmlParent = window.document.getElementById("resultats");
    var elementHtmlTextResult = window.document.getElementById("texte_resultats");
    var paths = elementHtmlParent.getElementsByTagName("g")[0].children;

    Array.from(paths).forEach(function (element) {
        element.addEventListener('click', function (event) {
            elementHtmlTextResult.innerHTML = element.getAttribute(baliseAffichage);
        });
    });
}

//Réponses à la question 9, et ajouts pour les questions 11 et 13.
function mouseoverSVG(svgDocumentUrl) {

    afficheSVG(svgDocumentUrl);

    var elementHtmlParent = window.document.getElementById("resultats");
    var elementHtmlTextResult = window.document.getElementById("texte_resultats");
    var paths = elementHtmlParent.getElementsByTagName("g")[0].children;

    Array.from(paths).forEach(function (element) {
        var codePays = element.getAttribute("id");

        element.addEventListener('mouseover', function (event) {

            elementHtmlTextResult.innerHTML = affichagePaysDrapeau(codePays, "cherchePaysInfos.xsl");

            //Recuperation monnaie + topLevelDomaine + ginni
            fetch("https://restcountries.eu/rest/v2/alpha/" + codePays.toLowerCase())
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    window.document.getElementById("monnaie").innerHTML = data.currencies[0].name;
                    window.document.getElementById("topleveldomain").innerHTML = data.topLevelDomain[0];
                    window.document.getElementById("gini").innerHTML = data.gini;
                });
            element.style.fill = "yellow";

            //Attention, ici la limite est de 1000 requetes par heure !!! ça pourrait donc ne plus fonctionner
            //Recuperation population
            fetch("http://api.geonames.org/countryInfo?username=swyzeoff&country=" + codePays.toUpperCase())

                .then(response => response.text())
                .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))

                .then(data => {
                    window.document.getElementById("population").innerHTML = data.getElementsByTagName("population")[0].innerHTML;

                })
        });
        //On efface certains champs lorsque l'on quitte les pays
        element.addEventListener('mouseleave', function (event) {
            window.document.getElementById("common_name").innerHTML = "";
            window.document.getElementById("the_capital").innerHTML = "";
            window.document.getElementById("drapeau").innerHTML = "";
            window.document.getElementById("monnaie").innerHTML = "";
            window.document.getElementById("population").innerHTML = "";
            window.document.getElementById("gini").innerHTML = "";
            window.document.getElementById("topleveldomain").innerHTML = "";

            element.style.fill = "#CCCCCC";
        });
    });
}

//Affiche les pays dont la/les langue(s) parlée(s) est/sont la/les même(s) que le pays sélectionné.
function langues(codePays) {
    //Document XML
    var xmlDocument = chargerHttpXML("../countriesTP.xml");

    //Langues du pays sélectionné
    var pathLanguages = "//country[country_codes/cca2 ='" + codePays + "' ]/languages";
    var langues = xmlDocument.evaluate(pathLanguages, xmlDocument, null, XPathResult.ANY_TYPE, null).iterateNext().children;
    var languesPays = [];
    for (i = 0; i < langues.length; i++) {
        languesPays.push(langues[i].innerHTML);
    }
    console.log("resultat_nom", languesPays);


    var pathCountries = "//countries";
    var countries = xmlDocument.evaluate(pathCountries, xmlDocument, null, XPathResult.ANY_TYPE, null).iterateNext().children;

    var paysMemeLangue = [];

    Array.from(countries).forEach((country) => {
        balisesLanguages = country.getElementsByTagName("languages");
        if (balisesLanguages.length > 0) {
            var tempLang = [];
            Array.from(balisesLanguages[0].children).forEach((langueN) => {
                tempLang.push(langueN.innerHTML)
            })

            //intersection des 2 tableaux
            if (languesPays.filter(x => tempLang.includes(x)).length > 0) {
                paysMemeLangue.push(country.getElementsByTagName("cca2")[0].innerHTML);
            }

        }
    })

    afficheSVG("worldHigh.svg");


    var elementHtmlParent = window.document.getElementById("resultats");
    var paths = elementHtmlParent.getElementsByTagName("g")[0].children;

    Array.from(paths).forEach(function (element) {
        if (paysMemeLangue.includes(element.getAttribute("id"))) {
            element.style.fill = "green";
        }
    });
}


//Réponse à la question 10, utilisation de datalist
function bouton3_autocompletion(textInput, datalistElement) {
    var xmlDocument = chargerHttpXML("../countriesTP.xml");
    var cca2s = xmlDocument.getElementsByTagName("cca2");

    var datalistHtml = ``;
    for (i = 0; i < cca2s.length; i++) {
        if (cca2s[i].innerHTML.includes(textInput.value.toUpperCase())) {
            datalistHtml += `<option value="${cca2s[i].innerHTML}"</option>`;
        }
    }
    datalistElement.innerHTML = datalistHtml;
}

//Fonction permettant d'effacer les balises dans lesquelles on affiche les résultats.
function effaceResultat() {
    window.document.getElementById("resultats").innerHTML = "";
    window.document.getElementById("texte_resultats").innerHTML = "";
}



//FONCTIONS DEJA PRESENTES DANS LE FICHIER DE DEPART ET UTILES POUR NOS PROPRES FONCTIONS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function recupererPremierEnfantDeTypeNode(n) {
    var x = n.firstChild;
    while (x.nodeType != 1) { // Test if x is an element node (and not a text node or other)
        x = x.nextSibling;
    }
    return x;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//charge le fichier XML se trouvant à l'URL relative donné dans le paramètre et le retourne
function chargerHttpXML(xmlDocumentUrl) {

    var httpAjax;

    httpAjax = window.XMLHttpRequest ?
        new XMLHttpRequest() :
        new ActiveXObject('Microsoft.XMLHTTP');

    if (httpAjax.overrideMimeType) {
        httpAjax.overrideMimeType('text/xml');
    }

    //chargement du fichier XML à l'aide de XMLHttpRequest synchrone (le 3e parametre est défini à false)
    httpAjax.open('GET', xmlDocumentUrl, false);
    httpAjax.send();

    return httpAjax.responseXML;
}