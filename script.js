function calcularMedia() {
    const camposNota = [
        { id: "notaTituloOriginal", peso: 1.0 },
        { id: "notaClassificacao", peso: 1.0 },
        { id: "notaPersonagens", peso: 1.5 },
        { id: "notaPerguntas", peso: 1.5 },
        { id: "notaTema", peso: 1.5 },
        { id: "notaVisuais", peso: 1.0 },
        { id: "notaSonoros", peso: 1.0 },
        { id: "notaConclusao", peso: 1.5 }
    ];

    let soma = 0;
    let somaPesos = 0;

    camposNota.forEach(campo => {
        const input = document.getElementById(campo.id);
        if (!input) return;

        const valor = parseFloat(input.value);

        if (!isNaN(valor)) {
            soma += valor; // NÃO multiplica por peso, pois valor máximo = peso
            somaPesos += campo.peso;
            input.classList.add("valido");
        } else {
            input.classList.remove("valido");
        }
    });

    // Arredondamento preciso
    const media = parseFloat(soma.toFixed(12));
    const mediaFinal = Math.round(media * 10) / 10;

    document.getElementById("mediaFinal").textContent = mediaFinal.toFixed(1);
}

function recolherDadosFormulario() {
  const personagensSelecionados = Array.from(document.querySelectorAll('input[name="personagens"]:checked'))
    .map(cb => cb.value)
    .join(", ");

  const perguntasSelecionadas = Array.from(document.querySelectorAll('input[name="perguntas"]:checked'))
    .map(cb => cb.value)
    .join(", ");

 // Os dados que serão salvos na planilha ou PDF
  const dados = {
    imagem: document.getElementById("imagem").files[0]?.name || "Nenhuma",
    diretor: document.getElementById("diretor")?.value || "",
    roteirista: document.getElementById("roteirista")?.value || "",
    generoPrincipal: document.getElementById("generoPrincipal")?.value || "",
    subgenero: document.getElementById("subgenero")?.value || "",
    dataLancamento: document.getElementById("dataLancamento")?.value || "",
    notaTitulo: document.getElementById("notaTitulo")?.value || "",
    tituloOriginal: document.getElementById("tituloOriginal")?.value || "",
    tituloNativo: document.getElementById("tituloNativo")?.value || "",
    classificacaoIndicativa: document.getElementById("classificacaoIndicativa")?.value || "",
    notaClassificacao: document.getElementById("notaClassificacao")?.value || "",
    personagens: personagensSelecionados,
    notaPersonagens: document.getElementById("notaPersonagens")?.value || "",
    perguntas: perguntasSelecionadas,
    notaPerguntas: document.getElementById("notaPerguntas")?.value || "",
    notaTema: document.getElementById("notaTema")?.value || "",
    temaEscrito: document.getElementById("temaEscrito")?.value || "",
    notaVisuais: document.getElementById("notaVisuais")?.value || "",
    efeitosEspeciais: document.getElementById("efeitosEspeciais")?.value || "",
    notaSonoros: document.getElementById("notaSonoros")?.value || "",
    trilhaSonora: document.getElementById("trilhaSonora")?.value || "",
    notaConclusao: document.getElementById("notaConclusao")?.value || "",
    comentarioFinal: document.getElementById("comentarioFinal")?.value || "",
    mediaFinal: document.getElementById("mediaFinal")?.textContent || ""
  };

  return dados;
}

window.jsPDF = window.jspdf.jsPDF;

// função para exportar o arquivo para a planilha
function exportarParaExcel() {
    try {
        const dados = recolherDadosFormulario();
        const ws = XLSX.utils.json_to_sheet([dados]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Avaliação");
        XLSX.writeFile(wb, "avaliacao_filme.xlsx");
    } catch (error) {
        console.error("Erro ao exportar para Excel:", error);
}
}

// função para salvar em PDF 
function exportarParaPDF() {
    try {
        const dados = recolherDadosFormulario();
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let y = 20;
        doc.setFontSize(12);
        doc.text("Avaliação de Filme", 20, y);
        y += 10;

         // Adiciona os dados ao PDF (exceto imagem)
        for (const chave in dados) {
            if (chave !== "imagem") {
                doc.text(`${chave}: ${dados[chave]}`, 20, y);
                y += 8;

                if (y > 260) {
                    doc.addPage();
                    y = 20;
                }
            }
        }

        // Salva a imagem gerada da capa para aparecer também no PDF
        const imagemInput = document.getElementById("imagem");
        const arquivo = imagemInput.files[0];

        if (arquivo) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const base64Image = e.target.result;

                // Adiciona imagem no canto superior direito
                doc.addImage(base64Image, 'JPEG', 140, 20, 50, 50);
                doc.save("avaliacao_filme.pdf");
            };
            reader.readAsDataURL(arquivo);
        } else {
            doc.save("avaliacao_filme.pdf");
        }

    } catch (error) {
        console.error("Erro ao exportar para PDF:", error);
    }
}