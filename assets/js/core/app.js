window.addEventListener("DOMContentLoaded", async () => {

    try {

        await loadAllComponents();

        console.log("MajFifty Robot iniciado.");

    } catch (erro) {

        console.error(erro);

    }

});