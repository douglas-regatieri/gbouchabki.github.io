"use strict";

const dadosManual = document.getElementById("dadosManual");
const saidaDados = document.getElementById("saidaDados");
const inserir = document.getElementById("inserir");
const exibir = document.getElementById("exibir");

const variavel = document.getElementById("variavel");
const nomeVariavel = document.getElementById("nomeVariavel");

const parametro = document.getElementById("parametro");

const medidaSeparatriz = document.getElementById("medida-separatriz");
const opcoesSeparatriz = document.getElementById("opcoes-separatriz");
const parSep = document.getElementById("parametroSeparatriz");

const opcaoDecil = document.getElementById("decil");
const opcaoPercentil = document.getElementById("percentil");

const tabela = document.getElementById("tabela");

const ctx = document.getElementsByClassName("line-chart");
const ctx2 = document.getElementsByClassName("line-chart2");
const ctx3 = document.getElementsByClassName("line-chart3");

const tabelaMedia = document.querySelector("#tabela-media");
const tabelaDesvio = document.querySelector("#tabela-desvio");
const tabelaSeparatriz = document.querySelector("#separatriz");

let todosDados;
let dadosSeparados = [];
let dadosRepetidos = [];
let mostraNomeVariavel = [];
let freq = [];

const ordem = document.querySelector("#ordem-resultado");
const ordinal = document.querySelector("#ordinal");

function exibirOpt() {
  opcoesSeparatriz.innerHTML = ''
  if (medidaSeparatriz.selectedIndex === 1) {
    
    for (let i = 1; i <= 4; i++) {
      let optQuartil = document.createElement("option");
      optQuartil.textContent = i;
      opcoesSeparatriz.appendChild(optQuartil);
      optQuartil.setAttribute('value', i)
    }
  }
  if (medidaSeparatriz.selectedIndex === 2) {

    for (let i = 1; i <= 5; i++) {
      let optQuintil = document.createElement("option");
      optQuintil.textContent = i;
      opcoesSeparatriz.appendChild(optQuintil);
      optQuintil.setAttribute('value', i)
    }
  }
  if (medidaSeparatriz.selectedIndex === 3) {

    for (let i = 1; i <= 10; i++) {
      let optDecil = document.createElement("option");
      optDecil.textContent = i;
      opcoesSeparatriz.appendChild(optDecil);
      optDecil.setAttribute('value', i);
    }
  }
  else if(medidaSeparatriz.selectedIndex === 4) {
    for (let i = 1; i <= 100; i++) {
      let optPercentil = document.createElement("option");
      optPercentil.textContent = i;
      opcoesSeparatriz.appendChild(optPercentil);
      optPercentil.setAttribute('value', i)
    }
  }
}

medidaSeparatriz.addEventListener('input', exibirOpt);

//Função para coletar os dados
function coletaDados() {
  tabela.innerHTML = "";

  // let valido = true

  if (nomeVariavel.value.trim() === "") {
    //Validar se o campo do nome da variável foi preenchido
    alert("Informe um nome de variável válido");
    nomeVariavel.focus();
    return 0;
  } else if (dadosManual.value.trim() === "") {
    //Validar se o campo dos dados foi preenchido
    alert("Informe dados válidos");
    dadosManual.focus();
    return 0;
  } else if (variavel.selectedIndex === 0) {
    //Validar se a opção de variável foi selecionada
    alert("Informe uma variável");
    variavel.focus();
    return 0;
  } else if (parametro.selectedIndex === 0) {
    //Validar se o parâmetro foi selecionado
    alert("Informe um parâmetro");
    parametro.focus();
    return 0;
  } else {
    todosDados = dadosManual.value; // Entrada de dados Manual
    dadosSeparados = todosDados.split(";"); // Converte String em Array
  }

  let obj = dadosSeparados.reduce(function (object, item) {
    if (!object[item]) {
      object[item] = 1;
    } else {
      object[item]++;
    }
    return object;
  }, {});

  let dados = Object.keys(obj);
  let fi = Object.values(obj);
  let xifi = Object.values(obj);
  let desvio = Object.values(obj);
  let desvioQ = Object.values(obj);
  let desvioFi = Object.values(obj);
  let fr = Object.values(obj);
  let fac = Object.values(obj);
  let facP = Object.values(obj);
  let ds = Object.values(obj);

  //Log para conferir Arrays no console
  console.log(dadosSeparados); //1
  console.log(dados); //2
  console.log(fi); //3

  // Tabela Exibição dos Dados

  function criarElemento(elemento) {
    return document.createElement(elemento);
  }

  let thead = criarElemento("thead");
  let tbody = criarElemento("tbody");

  let indicesTabela = [
    nomeVariavel.value,
    "Frequência",
    "Frequência (%)",
    "Frequência Aculmulada",
    "FAC%",
  ];

  tabela.appendChild(thead);
  tabela.appendChild(tbody);

  let linhaHead = criarElemento("tr");

  thead.appendChild(linhaHead);

  //---------------Tabela Media, Moda e Mediana

  let tabelaM = criarElemento("table");
  tabelaMedia.appendChild(tabelaM);
  tabelaM.classList.add("tabela");

  let mediaHead = criarElemento("thead");
  let mediabody = criarElemento("tbody");

  tabelaM.appendChild(mediaHead);
  tabelaM.appendChild(mediabody);

  let indicesMedia = ["Média", "Moda", "Mediana"];

  let linhaHeadM = criarElemento("tr");
  mediaHead.appendChild(linhaHeadM);

  for (let i = 0; i < indicesMedia.length; i++) {
    let thM = criarElemento("th");
    thM.textContent = indicesMedia[i];
    linhaHeadM.appendChild(thM);
  }

  // -----------------Tabela Desvio Padrão e Coeficiente de Variação (%)

  let tabelaD = criarElemento("table");
  tabelaDesvio.appendChild(tabelaD);
  tabelaD.classList.add("tabela");

  let desvioHead = criarElemento("thead");
  let desvioBody = criarElemento("tbody");

  tabelaD.appendChild(desvioHead);
  tabelaD.appendChild(desvioBody);

  let indicesDesvio = ["Desvio Padrão", "Coeficiênte de Variação (%)"];

  let linhaHeadD = criarElemento("tr");
  desvioHead.appendChild(linhaHeadD);

  for (let i = 0; i < indicesMedia.length; i++) {
    let thD = criarElemento("th");
    thD.textContent = indicesDesvio[i];
    linhaHeadD.appendChild(thD);
  }

  // -----------------Tabela Medida Separatriz -------------------------------
  let tabelaS = criarElemento("table");
  tabelaDesvio.appendChild(tabelaS);
  tabelaS.classList.add("tabela");

  let separatrizHead = criarElemento("thead");
  let separatrizBody = criarElemento("tbody");

  tabelaS.appendChild(separatrizHead);
  tabelaS.appendChild(separatrizBody);

  let linhaHeadS = criarElemento("tr");
  separatrizHead.appendChild(linhaHeadS);

  let thS = criarElemento("th");
  thS.textContent = "Medida Separatriz";
  linhaHeadS.appendChild(thS);

  thS.setAttribute("colspan", 2);

  if (variavel.selectedIndex == 1) { //Nominal********************************************************************************************

    let tituloTab = criarElemento("caption");
    tituloTab.textContent = "Váriavel Qualitativa Nominal";
    tituloTab.style.fontWeight = 700;
    tabela.appendChild(tituloTab);

    for (let i = 0; i < indicesTabela.length; i++) {
      let th = criarElemento("th");
      th.textContent = indicesTabela[i];
      linhaHead.appendChild(th);
    }

    let totalFi = 0;
    totalFi = fi.reduce((total, currentElement) => total + currentElement); //Soma dos elementos do "Fi" retornados em uma variável simples

    for (let i = 0; i < fi.length; i++) {
      //Calculo do "Fr"
      fr[i] = (fi[i] / totalFi) * 100;
    }

    fac[0] = fi[0];
    for (let i = 0; i < fi.length; i++) {
      //Calculo do "Fac"
      fac[i + 1] = fac[i + 0] + fi[i + 1];
    }

    facP[0] = fr[0];
    for (let i = 0; i < fi.length; i++) {
      //Calculo do "Fac%"
      facP[i + 1] = facP[i + 0] + fr[i + 1];
    }

    //Calcular a MODA

    function obterModa(arr) {
      let freqT = {};
      arr.forEach((elem) => (freqT[elem] = freqT[elem] + 1 || 1));

      let moda = [];
      let maxFreq = 0;
      for (let i in freqT) {
        if (freqT[i] > maxFreq) {
          moda = [i];
          maxFreq = freqT[i];
        } else if (freqT[i] === maxFreq) {
          moda.push([i]);
        }
      }
      if (moda.length === Object.keys(freqT).length) moda = [];

      return moda;
    }

    //Calculo da Mediana####

    let posCentro = (dadosSeparados.length - 1) / 2;
    var mediana = dadosSeparados[Math.round(posCentro)];

    //---- CALCULAR QUARTIL ----
      let posQuartil = parseInt(opcoesSeparatriz.value)
      let posQ = dadosSeparados[(Math.round((dadosSeparados.length) / 4)) * posQuartil ]
    //Calcular Quintil##########
      let posQuintil = parseInt(opcoesSeparatriz.value)
      let posQui = dadosSeparados[(Math.round((dadosSeparados.length) / 5)) * posQuintil ]

    //Calcular Decil##########
      let posDecil = parseInt(opcoesSeparatriz.value)
      let posD = dadosSeparados[(Math.round((dadosSeparados.length) / 10)) * posDecil ]

    //Calcular o Percentil##########
      let posPercentil = parseInt(opcoesSeparatriz.value)
      let posP = dadosSeparados[(Math.round((dadosSeparados.length) / 100)) * posPercentil ]

    //Exibição dos daods na nova tabela
    for (let i = 0; i < dados.length; i++) {
      let linha = criarElemento("tr");

      let tdDados = criarElemento("td");
      tdDados.textContent = dados[i];
      let tdFi = criarElemento("td");
      tdFi.textContent = fi[i];
      let tdFr = criarElemento("td");
      tdFr.textContent = fr[i].toFixed(2) + "%";
      let tdFac = criarElemento("td");
      tdFac.textContent = fac[i];
      let tdFacP = criarElemento("td");
      tdFacP.textContent = facP[i].toFixed(2) + "%";

      linha.appendChild(tdDados);
      linha.appendChild(tdFi);
      linha.appendChild(tdFr);
      linha.appendChild(tdFac);
      linha.appendChild(tdFacP);

      tbody.appendChild(linha);
    }

    //Tabela Média, Moda e Mediana (Continuação)
    let linhaMedia = criarElemento("tr");
    mediabody.appendChild(linhaMedia);

    let tdMedia = criarElemento("td");
    tdMedia.textContent = "Não Existe";
    linhaMedia.appendChild(tdMedia);

    let tdmoda = criarElemento("td");
    tdmoda.textContent = obterModa(dadosSeparados);
    linhaMedia.appendChild(tdmoda);

    let tdMediana = criarElemento("td");
    tdMediana.textContent = mediana;
    linhaMedia.appendChild(tdMediana);

    //Tabela Desvio Padrão e Coeficiênte de Variação (continuação)
    let linhaDesvio = criarElemento("tr");
    desvioBody.appendChild(linhaDesvio);

    let tdDesvio = criarElemento("td");
    tdDesvio.textContent = "Não Existe";
    linhaDesvio.appendChild(tdDesvio);

    let tdCoef = criarElemento("td");
    tdCoef.textContent = "Não Existe";
    linhaDesvio.appendChild(tdCoef);

    //Tabela Medida Separatriz (Continuação)
    if (medidaSeparatriz.selectedIndex === 1) {
      let indiceQuartil = 'Quartil ' + opcoesSeparatriz.value;

      let dadosQuartil = posQ;

        let linhaSepara = criarElemento("tr");
        separatrizBody.appendChild(linhaSepara);

        let tdSepara = criarElemento("td");
        tdSepara.textContent = indiceQuartil;
        linhaSepara.appendChild(tdSepara);
        tdSepara.classList.add("text-align-right");

        let tdSeparaDado = criarElemento("td");
        tdSeparaDado.textContent = dadosQuartil;
        linhaSepara.appendChild(tdSeparaDado);
        tdSeparaDado.classList.add("text-align-left");
    } 
    else if (medidaSeparatriz.selectedIndex === 2) {
      let indiceQuintil = "Quintil " + opcoesSeparatriz.value;

      let dadosQuintil = posQui;

      let linhaSepara = criarElemento("tr");
      separatrizBody.appendChild(linhaSepara);

      let tdSepara = criarElemento("td");
      tdSepara.textContent = indiceQuintil;
      linhaSepara.appendChild(tdSepara);
      tdSepara.classList.add("text-align-right");

      let tdSeparaDado = criarElemento("td");
      tdSeparaDado.textContent = dadosQuintil;
      linhaSepara.appendChild(tdSeparaDado);
      tdSeparaDado.classList.add("text-align-left");
    } 
    else if (medidaSeparatriz.selectedIndex === 3) {
      let indiceDecil = 'Decil ' + opcoesSeparatriz.value

      let linhaSepara = criarElemento("tr");
      separatrizBody.appendChild(linhaSepara);

      let tdSepara = criarElemento("td");
      tdSepara.textContent = indiceDecil;
      linhaSepara.appendChild(tdSepara);
      tdSepara.classList.add("text-align-right");

      let tdSeparaDado = criarElemento("td");
      tdSeparaDado.textContent = posD;
      linhaSepara.appendChild(tdSeparaDado);
      tdSeparaDado.classList.add("text-align-left");
    }
    else if (medidaSeparatriz.selectedIndex === 4) {
      let indicePercentil = 'Percentil ' + opcoesSeparatriz.value

      let linhaSepara = criarElemento("tr");
      separatrizBody.appendChild(linhaSepara);

      let tdSepara = criarElemento("td");
      tdSepara.textContent = indicePercentil;
      linhaSepara.appendChild(tdSepara);
      tdSepara.classList.add("text-align-right");

      let tdSeparaDado = criarElemento("td");
      tdSeparaDado.textContent = posP;
      linhaSepara.appendChild(tdSeparaDado);
      tdSeparaDado.classList.add("text-align-left");
    }

    let n = dadosSeparados.length;
    let resSep = 0;
    let mostraSep;
    if ((medidaSeparatriz.selectedIndex = 1)) {
      //Calculando Quartil
      resSep = n / parSep;
      mostraSep = dadosSeparados[resSep];
    }

    console.log(dadosSeparados[resSep]);

    //GRÁFICO
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: dados,
        datasets: [
          {
            data: fr,
            backgroundColor: "#6495ED",
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "FR%",
          fontSize: 45,
        },
      },
    });
  } else if (variavel.selectedIndex == 2) {
    //Ordinal***************************************************************************************

    //Criar Cabeçalho Tabela
    let tituloTab = criarElemento("caption");
    tituloTab.textContent = "Váriavel Qualitativa Ordinal";
    tituloTab.style.fontWeight = 700;
    tabela.appendChild(tituloTab);

    for (let i = 0; i < indicesTabela.length; i++) {
      let th = criarElemento("th");
      th.textContent = indicesTabela[i];
      linhaHead.appendChild(th);
    }

    //-------- Calculos ----------
    //Soma dos elementos do "Fi" retornados em uma variável simples
    let totalFi = 0;
    totalFi = fi.reduce((total, currentElement) => total + currentElement);

    for (let i = 0; i < fi.length; i++) {
      //Calculo do "Fr"
      fr[i] = (fi[i] / totalFi) * 100;
    }

    fac[0] = fi[0];
    for (let i = 0; i < fi.length; i++) {
      //Calculo do "Fac"
      fac[i + 1] = fac[i + 0] + fi[i + 1];
    }

    facP[0] = fr[0];
    for (let i = 0; i < fi.length; i++) {
      //Calculo do "Fac%"
      facP[i + 1] = facP[i + 0] + fr[i + 1];
    }

    //Calcular a MODA

    function obterModa(arr) {
      let freqT = {};
      arr.forEach((elem) => (freqT[elem] = freqT[elem] + 1 || 1));

      let moda = [];
      let maxFreq = 0;
      for (let i in freqT) {
        if (freqT[i] > maxFreq) {
          moda = [i];
          maxFreq = freqT[i];
        } else if (freqT[i] === maxFreq) {
          moda.push([i]);
        }
      }
      if (moda.length === Object.keys(freqT).length) moda = [];

      return moda;
    }

    //Calculo da Mediana####
    let posCentro = dadosSeparados.length / 2;
    var mediana = dadosSeparados[Math.round(posCentro - 1)];

    //Q1
    let posQ1 = dadosSeparados.length / 4; //Q1
    let q1 = dadosSeparados[Math.round(posQ1 - 1)];

    let mq3 = posQ1 * 3; // Q3
    let q3 = dadosSeparados[Math.round(mq3 - 1)];

    //Calcular Quintil##########

    let posK1 = dadosSeparados.length / 5; //K1
    let k1 = dadosSeparados[Math.round(posK1 - 1)];

    let mk2 = posK1 * 2; //K2
    let k2 = dadosSeparados[Math.round(mk2 - 1)];

    let mk3 = posK1 * 3; //K3
    let k3 = dadosSeparados[Math.round(mk3 - 1)];

    let mk4 = posK1 * 4; //K4
    let k4 = dadosSeparados[Math.round(mk4 - 1)];

    //Calcular Decil##########

    let posD1 = dadosSeparados.length / 10; //K1
    let d1 = dadosSeparados[Math.round(posD1 - 1)];

    let md2 = posD1 * 2;
    let d2 = dadosSeparados[Math.round(md2 - 1)];

    let md3 = posD1 * 3;
    let d3 = dadosSeparados[Math.round(md3 - 1)];

    let md4 = posD1 * 4;
    let d4 = dadosSeparados[Math.round(md4 - 1)];

    let md5 = posD1 * 5;
    let d5 = dadosSeparados[Math.round(md5 - 1)];

    let md6 = posD1 * 6;
    let d6 = dadosSeparados[Math.round(md6 - 1)];

    let md7 = posD1 * 7;
    let d7 = dadosSeparados[Math.round(md7 - 1)];

    let md8 = posD1 * 8;
    let d8 = dadosSeparados[Math.round(md8 - 1)];

    let md9 = posD1 * 9;
    let d9 = dadosSeparados[Math.round(md9 - 1)];

    let md10 = posD1 * 10;
    let d10 = dadosSeparados[Math.round(md10 - 1)];

    //Logs para conferir os arrays  no console
    console.log(totalFi);
    console.log(fr);

    //Exibição dos dados na nova tabela
    for (let i = 0; i < dados.length; i++) {
      let linha = criarElemento("tr");

      let posicao = dados.indexOf(dados[i]);

      let seta = criarElemento("span");
      let tdDados = criarElemento("td");
      let pDados = criarElemento("p");
      pDados.textContent = dados[i];
      let tdFi = criarElemento("td");
      let pFi = criarElemento("p");
      pFi.textContent = fi[i];
      let tdFr = criarElemento("td");
      let pFr = criarElemento("p");
      pFr.textContent = fr[i].toFixed(2) + "%";
      let tdFac = criarElemento("td");
      let pFac = criarElemento("p");
      pFac.textContent = fac[i];
      let tdFacP = criarElemento("td");
      let pFacP = criarElemento("p");
      pFacP.textContent = facP[i].toFixed(2) + "%";

      linha.appendChild(tdDados);
      linha.appendChild(tdFi);
      linha.appendChild(tdFr);
      linha.appendChild(tdFac);
      linha.appendChild(tdFacP);

      tdDados.appendChild(pDados);
      tdFi.appendChild(pFi);
      tdFr.appendChild(pFr);
      tdFac.appendChild(pFac);
      tdFacP.appendChild(pFacP);

      tdDados.appendChild(seta);

      seta.classList.add("seta");
      seta.setAttribute("onclick", "moveDown(" + posicao + ")");

      pDados.classList.add("dado");
      pFi.classList.add("fi");
      pFr.classList.add("fr");
      pFac.classList.add("fac");
      pFacP.classList.add("facP");

      tbody.appendChild(linha);
      linha.classList.add("linha-tabela");
    }

    //Tabela Média, Moda e Mediana (Continuação)
    let linhaMedia = criarElemento("tr");
    mediabody.appendChild(linhaMedia);

    let tdMedia = criarElemento("td");
    tdMedia.textContent = "Não Existe";
    linhaMedia.appendChild(tdMedia);

    let tdmoda = criarElemento("td");
    tdmoda.textContent = obterModa(dadosSeparados);
    linhaMedia.appendChild(tdmoda);

    let tdMediana = criarElemento("td");
    tdMediana.textContent = mediana;
    linhaMedia.appendChild(tdMediana);

    //Tabela Desvio Padrão e Coeficiênte de Variação (continuação)
    let linhaDesvio = criarElemento("tr");
    desvioBody.appendChild(linhaDesvio);

    let tdDesvio = criarElemento("td");
    tdDesvio.textContent = "Não Existe";
    linhaDesvio.appendChild(tdDesvio);

    let tdCoef = criarElemento("td");
    tdCoef.textContent = "Não Existe";
    linhaDesvio.appendChild(tdCoef);

    //Tabela Medida Separatriz (Continuação)
    if (medidaSeparatriz.selectedIndex === 1) {
      let indiceQuartil = ["Quartil 1", "Quartil 2", "Quartil 3"];

      let dadosQuartil = [q1, mediana, q3];

      for (let i = 0; i < indiceQuartil.length; i++) {
        let linhaSepara = criarElemento("tr");
        separatrizBody.appendChild(linhaSepara);

        let tdSepara = criarElemento("td");
        tdSepara.textContent = indiceQuartil[i];
        linhaSepara.appendChild(tdSepara);
        tdSepara.classList.add("text-align-right");

        let tdSeparaDado = criarElemento("td");
        tdSeparaDado.textContent = dadosQuartil[i];
        linhaSepara.appendChild(tdSeparaDado);
        tdSeparaDado.classList.add("text-align-left");
      }
    } else if (medidaSeparatriz.selectedIndex === 2) {
      let indiceQuintil = ["Quintil 1", "Quintil 2", "Quintil 3", "Quintil 4"];

      let dadosQuintil = [k1, k2, k3, k4];

      for (let i = 0; i < indiceQuintil.length; i++) {
        let linhaSepara = criarElemento("tr");
        separatrizBody.appendChild(linhaSepara);

        let tdSepara = criarElemento("td");
        tdSepara.textContent = indiceQuintil[i];
        linhaSepara.appendChild(tdSepara);
        tdSepara.classList.add("text-align-right");

        let tdSeparaDado = criarElemento("td");
        tdSeparaDado.textContent = dadosQuintil[i];
        linhaSepara.appendChild(tdSeparaDado);
        tdSeparaDado.classList.add("text-align-left");
      }
    } else if (medidaSeparatriz.selectedIndex === 3) {
      let indiceDecil = [
        "Decil 1",
        "Decil 2",
        "Decil 3",
        "Decil 4",
        "Decil 5",
        "Decil 6",
        "Decil 7",
        "Decil 8",
        "Decil 9",
        "Decil 10",
      ];

      let dadosDecil = [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10];

      for (let i = 0; i < indiceDecil.length; i++) {
        let linhaSepara = criarElemento("tr");
        separatrizBody.appendChild(linhaSepara);

        let tdSepara = criarElemento("td");
        tdSepara.textContent = indiceDecil[i];
        linhaSepara.appendChild(tdSepara);
        tdSepara.classList.add("text-align-right");

        let tdSeparaDado = criarElemento("td");
        tdSeparaDado.textContent = dadosDecil[i];
        linhaSepara.appendChild(tdSeparaDado);
        tdSeparaDado.classList.add("text-align-left");
      }
    }

    //GRÁFICO
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: dados,
        datasets: [
          {
            data: fr,
            backgroundColor: "#6495ED",
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "FR%",
          fontSize: 45,
        },
      },
    });
  } else if (variavel.selectedIndex == 3) {
    //Discreta**************************************************************************************

    function ordernarNumeros(a, b) {
      return a - b;
    }
    dadosSeparados.sort(ordernarNumeros); //Ordenar numeros em ordem crescente

    let tituloTab = criarElemento("caption");
    tituloTab.textContent = "Váriavel Quantitativa Discreta";
    tituloTab.style.fontWeight = 700;
    tabela.appendChild(tituloTab);

    for (let i = 0; i < indicesTabela.length; i++) {
      let th = criarElemento("th");
      th.textContent = indicesTabela[i];
      linhaHead.appendChild(th);
    }

    let totalFi = 0;
    totalFi = fi.reduce((total, currentElement) => total + currentElement); //Soma dos elementos do "Fi" retornados em uma variável simples

    for (let i = 0; i < fi.length; i++) {
      //Calculo do "Fr"
      fr[i] = (fi[i] / totalFi) * 100;
    }

    fac[0] = fi[0];
    for (let i = 0; i < fi.length; i++) {
      //Calculo do "Fac"
      fac[i + 1] = fac[i + 0] + fi[i + 1];
    }

    facP[0] = fr[0];
    for (let i = 0; i < fi.length; i++) {
      //Calculo do "Fac%"
      facP[i + 1] = facP[i + 0] + fr[i + 1];
    }

    //Calculo da média######
    let soma = 0;
    let media = 0;
    soma = dadosSeparados.reduce((t, n) => n++ + t, 0); // Soma do vetor dadosSeparados para calcular a média dos dados inseridos
    media = soma / dadosSeparados.length;

    //Calcular a MODA

    function obterModa(arr) {
      let freqT = {};
      arr.forEach((elem) => (freqT[elem] = freqT[elem] + 1 || 1));

      let moda = [];
      let maxFreq = 0;
      for (let i in freqT) {
        if (freqT[i] > maxFreq) {
          moda = [i];
          maxFreq = freqT[i];
        } else if (freqT[i] === maxFreq) {
          moda.push([i]);
        }
      }
      if (moda.length === Object.keys(freqT).length) moda = [];

      return moda;
    }

    //Calculo da Mediana####

    if (dadosSeparados.length % 2 == 0) {
      let pos1 = dadosSeparados.length / 2;
      let pos2 = pos1 - 1;
      let elem1 = dadosSeparados[pos1];
      let elem2 = dadosSeparados[pos2];
      var mediana = (parseInt(elem1) + parseInt(elem2)) / 2;
    } else {
      let posCentro = (dadosSeparados.length - 1) / 2;
      var mediana = dadosSeparados[posCentro];
    }

    //Q1
    let posQ1 = dadosSeparados.length / 4; //Q1
    let q1 = dadosSeparados[Math.round(posQ1 - 1)];

    let mq3 = posQ1 * 3; // Q3
    let q3 = dadosSeparados[Math.round(mq3 - 1)];

    //Calcular Quintil##########

    let posK1 = dadosSeparados.length / 5; //K1
    let k1 = dadosSeparados[Math.round(posK1 - 1)];

    let mk2 = posK1 * 2; //K2
    let k2 = dadosSeparados[Math.round(mk2 - 1)];

    let mk3 = posK1 * 3; //K3
    let k3 = dadosSeparados[Math.round(mk3 - 1)];

    let mk4 = posK1 * 4; //K4
    let k4 = dadosSeparados[Math.round(mk4 - 1)];

    //Calcular Decil##########

    let posD1 = dadosSeparados.length / 10; //K1
    let d1 = dadosSeparados[Math.round(posD1 - 1)];

    let md2 = posD1 * 2;
    let d2 = dadosSeparados[Math.round(md2 - 1)];

    let md3 = posD1 * 3;
    let d3 = dadosSeparados[Math.round(md3 - 1)];

    let md4 = posD1 * 4;
    let d4 = dadosSeparados[Math.round(md4 - 1)];

    let md5 = posD1 * 5;
    let d5 = dadosSeparados[Math.round(md5 - 1)];

    let md6 = posD1 * 6;
    let d6 = dadosSeparados[Math.round(md6 - 1)];

    let md7 = posD1 * 7;
    let d7 = dadosSeparados[Math.round(md7 - 1)];

    let md8 = posD1 * 8;
    let d8 = dadosSeparados[Math.round(md8 - 1)];

    let md9 = posD1 * 9;
    let d9 = dadosSeparados[Math.round(md9 - 1)];

    let md10 = posD1 * 10;
    let d10 = dadosSeparados[Math.round(md10 - 1)];

    //Cacular XI.FI
    for (let i = 0; i < dados.length; i++) {
      xifi[i] = dados[i] * fi[i];
    }

    //Soma dos elementos do "xifi" retornados em uma variável simples
    let totalXifi = 0;
    for (let i in xifi) {
      totalXifi += xifi[i];
    }

    //Média aritimética ponderada
    let map = 0;
    map = totalXifi / totalFi;

    //Calculando o desvio
    for (let i = 0; i < dados.length; i++) {
      if (dados[i] > map) {
        desvio[i] = dados[i] - map;
      } else {
        desvio[i] = map - dados[i];
      }
    }

    //Calculando desvio ao quadrado
    for (let i = 0; i < desvio.length; i++) {
      desvioQ[i] = desvio[i] * desvio[i];
    }

    //Calculando desvioQ * f1
    for (let i = 0; i < desvioQ.length; i++) {
      desvioFi[i] = desvioQ[i] * fi[i];
    }

    //Soma dos elementos do "desvioFi" retornados em uma variável simples
    let totalDesvioFi = 0;
    for (let i in desvioFi) {
      totalDesvioFi += desvioFi[i];
    }

    //Calculo Variância
    let variancia = 0;
    if (parametro.selectedIndex == 1) {
      // Calculo da variância para parâmetro População ****
      variancia = totalDesvioFi / totalFi;
    } else if (parametro.selectedIndex == 2) {
      variancia = totalDesvioFi / (totalFi - 1);
    }

    //Calculo Desvio Padrão
    let desvioPadrao = 0;
    desvioPadrao = Math.sqrt(variancia);

    //Calculo coeficiente de variação
    let coefVar = 0;
    coefVar = (desvioPadrao / media) * 100;

    //Logs para conferir os arrays  no console
    console.log(totalFi);
    console.log(fr);

    //Exibição dos dados na nova tabela
    for (let i = 0; i < dados.length; i++) {
      let linha = criarElemento("tr");

      let tdDados = criarElemento("td");
      tdDados.textContent = dados[i];
      let tdFi = criarElemento("td");
      tdFi.textContent = fi[i];
      let tdFr = criarElemento("td");
      tdFr.textContent = fr[i].toFixed(2) + "%";
      let tdFac = criarElemento("td");
      tdFac.textContent = fac[i];
      let tdFacP = criarElemento("td");
      tdFacP.textContent = facP[i].toFixed(2) + "%";

      linha.appendChild(tdDados);
      linha.appendChild(tdFi);
      linha.appendChild(tdFr);
      linha.appendChild(tdFac);
      linha.appendChild(tdFacP);

      tbody.appendChild(linha);
    }

    //Tabela Média, Moda e Mediana (Continuação)
    let linhaMedia = criarElemento("tr");
    mediabody.appendChild(linhaMedia);

    let tdMedia = criarElemento("td");
    tdMedia.textContent = media.toFixed(2);
    linhaMedia.appendChild(tdMedia);

    let tdmoda = criarElemento("td");
    tdmoda.textContent = obterModa(dadosSeparados);
    linhaMedia.appendChild(tdmoda);

    let tdMediana = criarElemento("td");
    tdMediana.textContent = mediana;
    linhaMedia.appendChild(tdMediana);

    //Tabela Desvio Padrão e Coeficiênte de Variação (continuação)
    let linhaDesvio = criarElemento("tr");
    desvioBody.appendChild(linhaDesvio);

    let tdDesvio = criarElemento("td");
    tdDesvio.textContent = desvioPadrao.toFixed(2);
    linhaDesvio.appendChild(tdDesvio);

    let tdCoef = criarElemento("td");
    tdCoef.textContent = coefVar.toFixed(2) + "%";
    linhaDesvio.appendChild(tdCoef);

    //Tabela Medida Separatriz (Continuação)
    if (medidaSeparatriz.selectedIndex === 1) {
      let indiceQuartil = ["Quartil 1", "Quartil 2", "Quartil 3"];

      let dadosQuartil = [q1, mediana, q3];

      for (let i = 0; i < indiceQuartil.length; i++) {
        let linhaSepara = criarElemento("tr");
        separatrizBody.appendChild(linhaSepara);

        let tdSepara = criarElemento("td");
        tdSepara.textContent = indiceQuartil[i];
        linhaSepara.appendChild(tdSepara);
        tdSepara.classList.add("text-align-right");

        let tdSeparaDado = criarElemento("td");
        tdSeparaDado.textContent = dadosQuartil[i];
        linhaSepara.appendChild(tdSeparaDado);
        tdSeparaDado.classList.add("text-align-left");
      }
    } else if (medidaSeparatriz.selectedIndex === 2) {
      let indiceQuintil = ["Quintil 1", "Quintil 2", "Quintil 3", "Quintil 4"];

      let dadosQuintil = [k1, k2, k3, k4];

      for (let i = 0; i < indiceQuintil.length; i++) {
        let linhaSepara = criarElemento("tr");
        separatrizBody.appendChild(linhaSepara);

        let tdSepara = criarElemento("td");
        tdSepara.textContent = indiceQuintil[i];
        linhaSepara.appendChild(tdSepara);
        tdSepara.classList.add("text-align-right");

        let tdSeparaDado = criarElemento("td");
        tdSeparaDado.textContent = dadosQuintil[i];
        linhaSepara.appendChild(tdSeparaDado);
        tdSeparaDado.classList.add("text-align-left");
      }
    } else if (medidaSeparatriz.selectedIndex === 3) {
      let indiceDecil = [
        "Decil 1",
        "Decil 2",
        "Decil 3",
        "Decil 4",
        "Decil 5",
        "Decil 6",
        "Decil 7",
        "Decil 8",
        "Decil 9",
        "Decil 10",
      ];

      let dadosDecil = [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10];

      for (let i = 0; i < indiceDecil.length; i++) {
        let linhaSepara = criarElemento("tr");
        separatrizBody.appendChild(linhaSepara);

        let tdSepara = criarElemento("td");
        tdSepara.textContent = indiceDecil[i];
        linhaSepara.appendChild(tdSepara);
        tdSepara.classList.add("text-align-right");

        let tdSeparaDado = criarElemento("td");
        tdSeparaDado.textContent = dadosDecil[i];
        linhaSepara.appendChild(tdSeparaDado);
        tdSeparaDado.classList.add("text-align-left");
      }
    }

    //GRÁFICO
    new Chart(ctx, {
      type: "bar",
      label: " ",
      data: {
        labels: dados,
        datasets: [
          {
            label: "FR%",
            data: fr,
            borderWidth: 1,
            backgroundColor: "#6495ED",
            borderColor: "#F8F8FF",
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        title: {
          display: true,
          fontSize: 45,
        },
      },
    });
  } else if (variavel.selectedIndex == 4) {
    //Contínua**************************************************************************************

    for (let i = 0; i < dadosSeparados.length; i++) {
      dadosSeparados[i] = parseFloat(dadosSeparados[i]);
    }
    console.log(dadosSeparados);

    function ordernarNumeros(a, b) {
      return a - b;
    }
    dadosSeparados.sort(ordernarNumeros); //Ordena elementos do menor para o maior

    //-------CALCULOS INTERVALOS---------------
    let at = 0; //Amplitude
    let xmin = 0; // Menor Numero
    let xmax = 0; //Maior Numero
    let k = 0; //Numero de Linhas
    let n = 0; // Quantidade de Elementos
    let intervalo = 0;

    n = dadosSeparados.length; //Conta a quantidade de elementos da Array de entrada de dados
    xmin = dadosSeparados[0]; //Captura qual o primeiro elemento da Array
    xmax = dadosSeparados.slice(-1)[0]; //Captura o ultimo elemento do Array
    at = xmax - xmin; //Subtração do primeiro elemento pelo ultimo elemento
    at++; // Acrescimo de + 1 à amplitude
    k = Math.sqrt(n); //Calcula a Raiz Quadrada da quantidade de elementos da Array de entrada de dados. Esse dado representa a quantidade de linhas que a tabela deverá ter

    //Calculo do intervalo dos agrupamentos
    let lk2 = Math.round(k);
    let lk1 = lk2 - 1;
    let lk3 = lk2 + 1;

    let linhas = 0;

    let valid = false;
    do {
      if (at % lk1 === 0) {
        intervalo = at / lk1;
        linhas = lk1;
        valid = true;
      } else if (at % lk2 === 0) {
        intervalo = at / lk2;
        linhas = lk2;
        valid = true;
      } else if (at % lk3 === 0) {
        intervalo = at / lk3;
        linhas = lk3;
        valid = true;
      } else {
        at++;
      }
      console.log("Amplitude: " + at);
      console.log("Numero de Linhas 1: " + lk1);
      console.log("Numero de Linhas 2: " + lk2);
      console.log("Numero de Linhas 3: " + lk3);
      console.log(valid);
    } while (valid === false);

    console.log("Quantidade de Elementos: " + n);
    console.log("Referência: " + at);
    console.log("Quantidade de Linhas: " + Math.round(k));
    console.log("Intervalo: " + Math.round(intervalo));

    let tituloTab = criarElemento("caption");
    tituloTab.textContent = "Váriavel Quantitativa Contínua";
    tituloTab.style.fontWeight = 700;
    tabela.appendChild(tituloTab);

    for (let i = 0; i < indicesTabela.length; i++) {
      let th = criarElemento("th");
      th.textContent = indicesTabela[i];
      linhaHead.appendChild(th);
    }

    let auxItv = dadosSeparados[0];
    let intervaloTemp = 0;
    let cont = 0;
    let acm = 0;
    let varAcm = [];

    let frCalc = 0;
    let facPCalc = 0;

    let labelContinua = [];
    let dataContinua = [];

    let mediaItv = [];
    let vetModa = [];
    let medianaIndex = [];

    for (let i = 0; i < linhas; i++) {
      intervaloTemp = auxItv + intervalo;
      console.log("Intervalo Temp: " + intervaloTemp);

      for (let x = acm; dadosSeparados[x] < Math.round(intervaloTemp); x++) {
        if (dadosSeparados[i] < intervaloTemp) {
          cont++;
          acm++;
        }
      }

      console.log("contador 2º FOR: " + cont);

      let linha = criarElemento("tr");
      tbody.appendChild(linha);

      let tdItv = criarElemento("td");
      tdItv.textContent = auxItv + " |-- " + Math.round(intervaloTemp);
      labelContinua.push(tdItv.textContent);
      linha.appendChild(tdItv);

      let tdFi = criarElemento("td");
      tdFi.textContent = cont;
      linha.appendChild(tdFi);

      let tdFr = criarElemento("td");
      frCalc = ((cont / dadosSeparados.length) * 100).toFixed(2);
      tdFr.textContent = frCalc + "%";
      dataContinua.push(frCalc);
      linha.appendChild(tdFr);

      let tdFac = criarElemento("td");
      tdFac.textContent = acm;
      linha.appendChild(tdFac);

      let tdFacP = criarElemento("td");
      facPCalc = ((acm / dadosSeparados.length) * 100).toFixed(2);
      tdFacP.textContent = facPCalc + "%";
      linha.appendChild(tdFacP);

      medianaIndex.push(auxItv);

      mediaItv.push((auxItv + Math.round(intervaloTemp)) / 2);
      console.log("Médias dos intervalos: " + mediaItv);

      vetModa.push(cont);
      varAcm.push(acm);
      // auxItv = Math.round(intervaloTemp)
      auxItv += intervalo;
      cont = 0;
      console.log("Contador Zerado: " + cont);

      tbody.appendChild(linha);
    }

    //Calculo Média ----------------------
    let totalMedia = [];
    for (let i = 0; i < mediaItv.length; i++) {
      totalMedia.push(mediaItv[i] * vetModa[i]);
    }
    console.log("Médias: " + totalMedia);

    let somaMedia = totalMedia.reduce(
      (somaMedia, element) => somaMedia + element
    );
    let media = somaMedia / acm;
    console.log("Media: " + totalMedia);

    //Calculo da Moda -------------------------

    let modaPos = obterPosMaior(vetModa);
    console.log("Posição da Moda: " + modaPos);

    //Descobre a posição do maior elemento
    function obterPosMaior(arr) {
      let posMaior = 0;
      let numMaior = arr[0];
      for (var pos in arr) {
        if (arr[pos] > numMaior) {
          numMaior = arr[pos];
          posMaior = pos;
        }
      }
      return posMaior;
    }

    let moda = mediaItv[modaPos];
    console.log("Moda: " + moda);

    //Calculo da Mediana####
    console.log("Mediana Index: " + medianaIndex);
    //Encontrar a Posição da Mediana
    let posMediana = acm / 2;
    console.log("Posição Mediana: " + posMediana);

    //Encontrar os valores de Fimd e Fant
    let fimd = 0;
    let fant = 0;
    let posFimd = 0;

    let verificado = false;
    let i = 0;

    do {
      if (varAcm[i] >= posMediana) {
        fimd = vetModa[i];
        fant = varAcm[i - 1];
        posFimd = i;
        verificado = true;
      } else {
        i++;
      }
      console.log(i);
      console.log(varAcm[i]);
      console.log(verificado);
    } while (verificado === false);

    let mediana =
      medianaIndex[posFimd] + ((posMediana - fant) / fimd) * intervalo;

    console.log("Posição I: " + medianaIndex[posFimd]);
    console.log("Mediana: " + mediana);
    console.log("Fimd: " + fimd);
    console.log("Fant: " + fant);
    console.log("posFimd: " + posFimd);

    // Calcular Quartil##########
    let totalFi = 0;
    totalFi = vetModa.reduce((total, currentElement) => total + currentElement); //Soma dos elementos do "Fi" retornados em uma variável simples

    //Q1
    let posQ1 = dadosSeparados.length / 4; //Q1
    let q1 = dadosSeparados[Math.round(posQ1 - 1)];

    let mq3 = posQ1 * 3; // Q3
    let q3 = dadosSeparados[Math.round(mq3 - 1)];

    //Calcular Quintil##########

    let posK1 = dadosSeparados.length / 5; //K1
    let k1 = dadosSeparados[Math.round(posK1 - 1)];

    let mk2 = posK1 * 2; //K2
    let k2 = dadosSeparados[Math.round(mk2 - 1)];

    let mk3 = posK1 * 3; //K3
    let k3 = dadosSeparados[Math.round(mk3 - 1)];

    let mk4 = posK1 * 4; //K4
    let k4 = dadosSeparados[Math.round(mk4 - 1)];

    //Calcular Decil##########

    let posD1 = dadosSeparados.length / 10; //K1
    let d1 = dadosSeparados[Math.round(posD1 - 1)];

    let md2 = posD1 * 2;
    let d2 = dadosSeparados[Math.round(md2 - 1)];

    let md3 = posD1 * 3;
    let d3 = dadosSeparados[Math.round(md3 - 1)];

    let md4 = posD1 * 4;
    let d4 = dadosSeparados[Math.round(md4 - 1)];

    let md5 = posD1 * 5;
    let d5 = dadosSeparados[Math.round(md5 - 1)];

    let md6 = posD1 * 6;
    let d6 = dadosSeparados[Math.round(md6 - 1)];

    let md7 = posD1 * 7;
    let d7 = dadosSeparados[Math.round(md7 - 1)];

    let md8 = posD1 * 8;
    let d8 = dadosSeparados[Math.round(md8 - 1)];

    let md9 = posD1 * 9;
    let d9 = dadosSeparados[Math.round(md9 - 1)];

    let md10 = posD1 * 10;
    let d10 = dadosSeparados[Math.round(md10 - 1)];

    //Cacular XI.FI
    for (let i = 0; i < dados.length; i++) {
      xifi[i] = dados[i] * fi[i];
    }
    console.log("dados XI.FI: " + xifi);

    //Soma dos elementos do "xifi" retornados em uma variável simples
    let totalXifi = 0;
    for (let i in xifi) {
      totalXifi += xifi[i];
    }
    console.log("soma dos dados XI.FI: " + totalXifi);

    //Média aritimética ponderada
    let map = 0;
    map = totalXifi / totalFi;
    console.log("Média aritimética ponderada: " + map);

    //Calculando o desvio
    for (let i = 0; i < dados.length; i++) {
      if (dados[i] > map) {
        desvio[i] = dados[i] - map;
      } else {
        desvio[i] = map - dados[i];
      }
    }
    console.log("Desvio " + desvio);

    //Calculando desvio ao quadrado
    for (let i = 0; i < desvio.length; i++) {
      desvioQ[i] = desvio[i] * desvio[i];
    }
    console.log("Desvio ao Quadrado " + desvioQ);

    //Calculando desvioQ * f1
    for (let i = 0; i < desvioQ.length; i++) {
      desvioFi[i] = desvioQ[i] * fi[i];
    }
    console.log("Desvio ao Quadrado x frequencia " + desvioQ);

    //Soma dos elementos do "desvioFi" retornados em uma variável simples
    let totalDesvioFi = 0;
    for (let i in desvioFi) {
      totalDesvioFi += desvioFi[i];
    }
    console.log("somas dos Desvios ao Quadrado x frequencia " + totalDesvioFi);

    //Calculo Variância
    let variancia = 0;
    //Parametro População Selecionado
    if (parametro.selectedIndex === 1) {
      variancia = totalDesvioFi / totalFi;
      console.log("Variância " + variancia);
    }
    //Parametro Amostra Selecionado
    else {
      variancia = totalDesvioFi / (totalFi - 1);
      console.log("Variância " + variancia);
    }

    //Calculo Desvio Padrão
    let desvioPadrao = 0;
    desvioPadrao = Math.sqrt(variancia);
    console.log("Desvio Padrão:" + desvioPadrao);

    //Calculo coeficiente de variação

    let coefVar = 0;
    coefVar = (desvioPadrao / media) * 100;
    console.log("Coeficiênte de Variação:" + coefVar);

    //Logs para conferir os arrays  no console
    console.log(totalFi);
    console.log(fr);

    //Tabela Média, Moda e Mediana (Continuação)
    let linhaMedia = criarElemento("tr");
    mediabody.appendChild(linhaMedia);

    let tdMedia = criarElemento("td");
    tdMedia.textContent = media.toFixed(2);
    linhaMedia.appendChild(tdMedia);

    let tdmoda = criarElemento("td");
    tdmoda.textContent = moda.toFixed(2);
    linhaMedia.appendChild(tdmoda);

    let tdMediana = criarElemento("td");
    tdMediana.textContent = mediana.toFixed(2);
    linhaMedia.appendChild(tdMediana);

    //Tabela Desvio Padrão e Coeficiênte de Variação (continuação)
    let linhaDesvio = criarElemento("tr");
    desvioBody.appendChild(linhaDesvio);

    let tdDesvio = criarElemento("td");
    tdDesvio.textContent = desvioPadrao.toFixed(2);
    linhaDesvio.appendChild(tdDesvio);

    let tdCoef = criarElemento("td");
    tdCoef.textContent = coefVar.toFixed(2) + "%";
    linhaDesvio.appendChild(tdCoef);

    //Tabela Medida Separatriz (Continuação)
    if (medidaSeparatriz.selectedIndex === 1) {
      let indiceQuartil = ["Quartil 1", "Quartil 2", "Quartil 3"];

      let dadosQuartil = [q1, mediana - 1, q3];

      for (let i = 0; i < indiceQuartil.length; i++) {
        let linhaSepara = criarElemento("tr");
        separatrizBody.appendChild(linhaSepara);

        let tdSepara = criarElemento("td");
        tdSepara.textContent = indiceQuartil[i];
        linhaSepara.appendChild(tdSepara);
        tdSepara.classList.add("text-align-right");

        let tdSeparaDado = criarElemento("td");
        tdSeparaDado.textContent = dadosQuartil[i];
        linhaSepara.appendChild(tdSeparaDado);
        tdSeparaDado.classList.add("text-align-left");
      }
    } else if (medidaSeparatriz.selectedIndex === 2) {
      let indiceQuintil = ["Quintil 1", "Quintil 2", "Quintil 3", "Quintil 4"];

      let dadosQuintil = [k1, k2, k3, k4];

      for (let i = 0; i < indiceQuintil.length; i++) {
        let linhaSepara = criarElemento("tr");
        separatrizBody.appendChild(linhaSepara);

        let tdSepara = criarElemento("td");
        tdSepara.textContent = indiceQuintil[i];
        linhaSepara.appendChild(tdSepara);
        tdSepara.classList.add("text-align-right");

        let tdSeparaDado = criarElemento("td");
        tdSeparaDado.textContent = dadosQuintil[i];
        linhaSepara.appendChild(tdSeparaDado);
        tdSeparaDado.classList.add("text-align-left");
      }
    } else if (medidaSeparatriz.selectedIndex === 3) {
      let indiceDecil = [
        "Decil 1",
        "Decil 2",
        "Decil 3",
        "Decil 4",
        "Decil 5",
        "Decil 6",
        "Decil 7",
        "Decil 8",
        "Decil 9",
        "Decil 10",
      ];

      let dadosDecil = [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10];

      for (let i = 0; i < indiceDecil.length; i++) {
        let linhaSepara = criarElemento("tr");
        separatrizBody.appendChild(linhaSepara);

        let tdSepara = criarElemento("td");
        tdSepara.textContent = indiceDecil[i];
        linhaSepara.appendChild(tdSepara);
        tdSepara.classList.add("text-align-right");

        let tdSeparaDado = criarElemento("td");
        tdSeparaDado.textContent = dadosDecil[i];
        linhaSepara.appendChild(tdSeparaDado);
        tdSeparaDado.classList.add("text-align-left");
      }
    }

    //GRÁFICO
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labelContinua,
        datasets: [
          {
            label: "Fr%",
            data: dataContinua,
            borderWidth: 1,
            backgroundColor: "#6495ED",
            borderColor: "#F8F8FF",
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              display: false,
              barPercentage: 1.25,
              ticks: {
                max: 3,
              },
            },
            {
              display: true,
              ticks: {
                autoSkip: false,
                max: 4,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }
}

//Chamada da função no botão inserir
inserir.addEventListener("click", coletaDados);

//Ordenador da tabela
function moveDown(elem) {
  let totalDados = [];
  let totalFi = 0;
  let dados = [];
  let fi = [];
  let fr = [];
  let fac = [];
  let facP = [];
  let numLinhas = document.getElementsByClassName("linha-tabela");
  console.log(numLinhas);

  for (let i = 0; i < numLinhas.length; i++) {
    dados.push(document.querySelector(".dado").innerText);
    fi.push(document.querySelector(".fi").innerText);
    console.log(dados);
    let rDado = document.querySelector(".dado");
    rDado.classList.remove("dado");
    let rFi = document.querySelector(".fi");
    rFi.classList.remove("fi");
  }

  for (let i = 0; i < fi.length; i++) {
    fi[i] = parseInt(fi[i]);
    fr.push(fi[i]);
    fac.push(fi[i]);
    facP.push(fi[i]);
    // for(let x = 0; x < fi[i]; x++){
    //     totalDados.push(dados[i])
    // }
  }

  console.log(dados);
  console.log(fi);
  console.log("todos os dados abaixo vvvv");
  console.log(totalDados);

  tabela.innerHTML = "";
  tabelaMedia.innerHTML = "";
  tabelaDesvio.innerHTML = "";
  ctx.innerHTML = "";

  function changePosition(arr, from, to) {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
    return arr;
  }

  dados = changePosition(dados, elem, elem + 1);
  fi = changePosition(fi, elem, elem + 1);
  fr = changePosition(fr, elem, elem + 1);
  fac = changePosition(fac, elem, elem + 1);
  facP = changePosition(facP, elem, elem + 1);

  console.log(dados);

  for (let i = 0; i < fi.length; i++) {
    for (let x = 0; x < fi[i]; x++) {
      totalDados.push(dados[i]);
    }
  }

  console.log(totalDados);

  function criarElemento(elemento) {
    return document.createElement(elemento);
  }

  let thead = criarElemento("thead");
  let tbody = criarElemento("tbody");

  let indicesTabela = [
    nomeVariavel.value,
    "Frequência",
    "Frequência (%)",
    "Frequência Aculmulada",
    "FAC%",
  ];

  tabela.appendChild(thead);
  tabela.appendChild(tbody);

  let linhaHead = criarElemento("tr");

  thead.appendChild(linhaHead);

  let tituloTab = criarElemento("caption");
  tituloTab.textContent = "Váriavel Qualitativa Ordinal";
  tituloTab.style.fontWeight = 700;
  tabela.appendChild(tituloTab);

  for (let i = 0; i < indicesTabela.length; i++) {
    let th = criarElemento("th");
    th.textContent = indicesTabela[i];
    linhaHead.appendChild(th);
  }

  //---------------Tabela Media, Moda e Mediana

  let tabelaM = criarElemento("table");
  tabelaMedia.appendChild(tabelaM);
  tabelaM.classList.add("tabela");

  let mediaHead = criarElemento("thead");
  let mediabody = criarElemento("tbody");

  tabelaM.appendChild(mediaHead);
  tabelaM.appendChild(mediabody);

  let indicesMedia = ["Média", "Moda", "Mediana"];

  let linhaHeadM = criarElemento("tr");
  mediaHead.appendChild(linhaHeadM);

  for (let i = 0; i < indicesMedia.length; i++) {
    let thM = criarElemento("th");
    thM.textContent = indicesMedia[i];
    linhaHeadM.appendChild(thM);
  }

  // -----------------Tabela Desvio Padrão e Coeficiente de Variação (%)

  let tabelaD = criarElemento("table");
  tabelaDesvio.appendChild(tabelaD);
  tabelaD.classList.add("tabela");

  let desvioHead = criarElemento("thead");
  let desvioBody = criarElemento("tbody");

  tabelaD.appendChild(desvioHead);
  tabelaD.appendChild(desvioBody);

  let indicesDesvio = ["Desvio Padrão", "Coeficiênte de Variação (%)"];

  let linhaHeadD = criarElemento("tr");
  desvioHead.appendChild(linhaHeadD);

  for (let i = 0; i < indicesMedia.length; i++) {
    let thD = criarElemento("th");
    thD.textContent = indicesDesvio[i];
    linhaHeadD.appendChild(thD);
  }

  // -----------------Tabela Medida Separatriz -------------------------------
  let tabelaS = criarElemento("table");
  tabelaDesvio.appendChild(tabelaS);
  tabelaS.classList.add("tabela");

  let separatrizHead = criarElemento("thead");
  let separatrizBody = criarElemento("tbody");

  tabelaS.appendChild(separatrizHead);
  tabelaS.appendChild(separatrizBody);

  let linhaHeadS = criarElemento("tr");
  separatrizHead.appendChild(linhaHeadS);

  let thS = criarElemento("th");
  thS.textContent = "Medida Separatriz";
  linhaHeadS.appendChild(thS);

  thS.setAttribute("colspan", 2);

  //-----------CALCULOS-----------

  let total = 0;
  total = fi.reduce((total, currentElement) => total + currentElement);

  for (let i = 0; i < fi.length; i++) {
    //Calculo do "Fr"
    fr[i] = (fi[i] / total) * 100;
  }

  fac[0] = fi[0];
  for (let i = 0; i < fi.length; i++) {
    //Calculo do "Fac"
    fac[i + 1] = fac[i + 0] + fi[i + 1];
  }

  facP[0] = fr[0];
  for (let i = 0; i < fi.length; i++) {
    //Calculo do "Fac%"
    facP[i + 1] = facP[i + 0] + fr[i + 1];
  }

  //Calculo##########

  //Acha a frequência de um número no Array
  function calcularFreq(numero, dadosSeparados) {
    let num_vezes = 0;
    for (let pos in dadosSeparados) {
      if (dadosSeparados[pos] == numero) {
        num_vezes++;
      }
    }
    return num_vezes;
  }

  //Descobre a posição do maior elemento
  function obterPosMaior(dadosSeparados) {
    let posMaior = 0;
    let numMaior = dadosSeparados[0];
    for (var pos in dadosSeparados) {
      if (dadosSeparados[pos] > numMaior) {
        numMaior = dadosSeparados[pos];
        posMaior = pos;
      }
    }
    return posMaior;
  }

  //Função para calcular a MODA
  function obterModa(dadosSeparados) {
    let freq = new Array(dadosSeparados.length);
    for (let pos in dadosSeparados) {
      let numero = dadosSeparados[pos];
      freq[pos] = calcularFreq(numero, dadosSeparados);
    }
    let posModa = obterPosMaior(freq);
    return dadosSeparados[posModa];
  }

  let vetModa = dadosSeparados;
  let moda = obterModa(vetModa);

  //Calculo da Mediana####
  let posCentro = Math.round(totalDados.length / 2);
  let mediana = totalDados[posCentro - 1];

  console.log("Mediana: " + mediana);
  console.log("Posição Centro: " + posCentro);

  //Calcular Quartil##########

  //Q1
  let posQ1 = dadosSeparados.length / 4; //Q1
  let q1 = dadosSeparados[Math.round(posQ1 - 1)];

  let mq3 = posQ1 * 3; // Q3
  let q3 = dadosSeparados[Math.round(mq3 - 1)];

  //Calcular Quintil##########

  let posK1 = dadosSeparados.length / 5; //K1
  let k1 = dadosSeparados[Math.round(posK1 - 1)];

  let mk2 = posK1 * 2; //K2
  let k2 = dadosSeparados[Math.round(mk2 - 1)];

  let mk3 = posK1 * 3; //K3
  let k3 = dadosSeparados[Math.round(mk3 - 1)];

  let mk4 = posK1 * 4; //K4
  let k4 = dadosSeparados[Math.round(mk4 - 1)];

  //Calcular Decil##########

  let posD1 = dadosSeparados.length / 10; //K1
  let d1 = dadosSeparados[Math.round(posD1 - 1)];

  let md2 = posD1 * 2;
  let d2 = dadosSeparados[Math.round(md2 - 1)];

  let md3 = posD1 * 3;
  let d3 = dadosSeparados[Math.round(md3 - 1)];

  let md4 = posD1 * 4;
  let d4 = dadosSeparados[Math.round(md4 - 1)];

  let md5 = posD1 * 5;
  let d5 = dadosSeparados[Math.round(md5 - 1)];

  let md6 = posD1 * 6;
  let d6 = dadosSeparados[Math.round(md6 - 1)];

  let md7 = posD1 * 7;
  let d7 = dadosSeparados[Math.round(md7 - 1)];

  let md8 = posD1 * 8;
  let d8 = dadosSeparados[Math.round(md8 - 1)];

  let md9 = posD1 * 9;
  let d9 = dadosSeparados[Math.round(md9 - 1)];

  let md10 = posD1 * 10;
  let d10 = dadosSeparados[Math.round(md10 - 1)];

  for (let i = 0; i < dados.length; i++) {
    let linha = criarElemento("tr");

    let posicao = dados.indexOf(dados[i]);

    let seta = criarElemento("span");
    let tdDados = criarElemento("td");
    let pDados = criarElemento("p");
    pDados.textContent = dados[i];
    let tdFi = criarElemento("td");
    let pFi = criarElemento("p");
    pFi.textContent = fi[i];
    let tdFr = criarElemento("td");
    let pFr = criarElemento("p");
    pFr.textContent = fr[i].toFixed(2) + "%";
    let tdFac = criarElemento("td");
    let pFac = criarElemento("p");
    pFac.textContent = fac[i];
    let tdFacP = criarElemento("td");
    let pFacP = criarElemento("p");
    pFacP.textContent = facP[i].toFixed(2) + "%";

    linha.appendChild(tdDados);
    linha.appendChild(tdFi);
    linha.appendChild(tdFr);
    linha.appendChild(tdFac);
    linha.appendChild(tdFacP);

    tdDados.appendChild(pDados);
    tdFi.appendChild(pFi);
    tdFr.appendChild(pFr);
    tdFac.appendChild(pFac);
    tdFacP.appendChild(pFacP);

    tdDados.appendChild(seta);

    seta.classList.add("seta");
    seta.setAttribute("onclick", "moveDown(" + posicao + ")");

    pDados.classList.add("dado");
    pFi.classList.add("fi");
    pFr.classList.add("fr");
    pFac.classList.add("fac");
    pFacP.classList.add("facP");

    tbody.appendChild(linha);
    linha.classList.add("linha-tabela");
  }

  //Tabela Média, Moda e Mediana (Continuação)
  let linhaMedia = criarElemento("tr");
  mediabody.appendChild(linhaMedia);

  let tdMedia = criarElemento("td");
  tdMedia.textContent = "Não Existe";
  linhaMedia.appendChild(tdMedia);

  let tdmoda = criarElemento("td");
  tdmoda.textContent = moda;
  linhaMedia.appendChild(tdmoda);

  let tdMediana = criarElemento("td");
  tdMediana.textContent = mediana;
  linhaMedia.appendChild(tdMediana);

  //Tabela Desvio Padrão e Coeficiênte de Variação (continuação)
  let linhaDesvio = criarElemento("tr");
  desvioBody.appendChild(linhaDesvio);

  let tdDesvio = criarElemento("td");
  tdDesvio.textContent = "Não Existe";
  linhaDesvio.appendChild(tdDesvio);

  let tdCoef = criarElemento("td");
  tdCoef.textContent = "Não Existe";
  linhaDesvio.appendChild(tdCoef);

  if (medidaSeparatriz.selectedIndex === 1) {
    let indiceQuartil = ["Quartil 1", "Quartil 2", "Quartil 3"];

    let dadosQuartil = [q1, mediana, q3];

    for (let i = 0; i < indiceQuartil.length; i++) {
      let linhaSepara = criarElemento("tr");
      separatrizBody.appendChild(linhaSepara);

      let tdSepara = criarElemento("td");
      tdSepara.textContent = indiceQuartil[i];
      linhaSepara.appendChild(tdSepara);
      tdSepara.classList.add("text-align-right");

      let tdSeparaDado = criarElemento("td");
      tdSeparaDado.textContent = dadosQuartil[i];
      linhaSepara.appendChild(tdSeparaDado);
      tdSeparaDado.classList.add("text-align-left");
    }
  } else if (medidaSeparatriz.selectedIndex === 2) {
    let indiceQuintil = ["Quintil 1", "Quintil 2", "Quintil 3", "Quintil 4"];

    let dadosQuintil = [k1, k2, k3, k4];

    for (let i = 0; i < indiceQuintil.length; i++) {
      let linhaSepara = criarElemento("tr");
      separatrizBody.appendChild(linhaSepara);

      let tdSepara = criarElemento("td");
      tdSepara.textContent = indiceQuintil[i];
      linhaSepara.appendChild(tdSepara);
      tdSepara.classList.add("text-align-right");

      let tdSeparaDado = criarElemento("td");
      tdSeparaDado.textContent = dadosQuintil[i];
      linhaSepara.appendChild(tdSeparaDado);
      tdSeparaDado.classList.add("text-align-left");
    }
  } else if (medidaSeparatriz.selectedIndex === 3) {
    let indiceDecil = [
      "Decil 1",
      "Decil 2",
      "Decil 3",
      "Decil 4",
      "Decil 5",
      "Decil 6",
      "Decil 7",
      "Decil 8",
      "Decil 9",
      "Decil 10",
    ];

    let dadosDecil = [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10];

    for (let i = 0; i < indiceDecil.length; i++) {
      let linhaSepara = criarElemento("tr");
      separatrizBody.appendChild(linhaSepara);

      let tdSepara = criarElemento("td");
      tdSepara.textContent = indiceDecil[i];
      linhaSepara.appendChild(tdSepara);
      tdSepara.classList.add("text-align-right");

      let tdSeparaDado = criarElemento("td");
      tdSeparaDado.textContent = dadosDecil[i];
      linhaSepara.appendChild(tdSeparaDado);
      tdSeparaDado.classList.add("text-align-left");
    }
  }

  //GRÁFICO
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: dados,
      datasets: [
        {
          data: fr,
          borderWidth: 1,
          backgroundColor: "#6495ED",
          borderColor: "#F8F8FF",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      title: {
        display: true,
        text: "FR%",
        fontSize: 45,
      },
    },
  });
}
