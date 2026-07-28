window.addEventListener("DOMContentLoaded", async () => {

    try {

        await loadAllComponents();

        initializeBlockly();

        console.log("MajFifty Robot iniciado.");

    } catch (erro) {

        console.error(erro);

    }

});