const UI = {

    updateBoard(){

        document.querySelector(".board").textContent =
            State.board.name;

        document.querySelector(".port").textContent =
            State.board.port;

    },

    updateStatus(){

        const status =
            document.querySelector(".status");

        status.textContent =
            State.board.connected
                ? "● Conectado"
                : "● Desconectado";

        status.className =
            State.board.connected
                ? "status connected"
                : "status disconnected";

    }

};