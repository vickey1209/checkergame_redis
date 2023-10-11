import { EVENT_NAME, REDIS_KEY } from "../constants";
import Event from "../eventEmitter";
import Table from "../interface/tableInterface";
import logger from "../logger";
import { Get } from "../redisOperation";
import { checkPossibilityValidation } from "../validation/requestValidation/";
import { resPossibilityValidation } from "../validation/responseValidation";
const checkPOssibility = async (data: any, socket: any) => {
  try {
    data = await checkPossibilityValidation(data);
    if (data) {
      let tableData:Table = await Get(
        `${REDIS_KEY.REDIS_TABLE}:${socket.tableId}`
      );
      if (tableData) {
        let board:number[][] = tableData.board;
        let row: number =
          data.data.index % 8 == 0
            ? Math.floor(data.data.index / 8) - 1
            : Math.floor(data.data.index / 8);
        let col:number = data.data.index - row * 8 - 1;
        let color = data.data.color;
        // A=1 , B=2, C=3, D=4
        let A = row - 1 >= 0 && col - 1 >= 0 ? board[row - 1][col - 1] : null;
        let B = row - 1 >= 0 && col + 1 <= 7 ? board[row - 1][col + 1] : null;
        let C = row + 1 <= 7 && col + 1 <= 7 ? board[row + 1][col + 1] : null;
        let D = row + 1 <= 7 && col - 1 >= 0 ? board[row + 1][col - 1] : null;

        let KA = row - 2 >= 0 && col - 2 >= 0 ? board[row - 2][col - 2] : null;
        let KB = row - 2 >= 0 && col + 2 <= 7 ? board[row - 2][col + 2] : null;
        let KC = row + 2 <= 7 && col + 2 <= 7 ? board[row + 2][col + 2] : null;
        let KD = row + 2 <= 7 && col - 2 >= 0 ? board[row + 2][col - 2] : null;
        let possibilityData: any = {
          eventName: EVENT_NAME.CHECK_POSSIBILITY,
          data: {
            row: [],
            col: [],
            killRow: [],
            killCol: [],
            kill: [],
            userId:
              color == 5 ? tableData.player[1]._id : tableData.player[0]._id,
          },
        };
        // black
        if (color == 2) {
          possibilityData.data.userId = tableData.player[1]._id;
          if ((A == 1 || A == 8) && (B == 1 || B == 8) && KB == 0 && KA == 0) {
            possibilityData.data.killRow = [row - 2, row - 2];
            possibilityData.data.killCol = [col + 2, col - 2];
            possibilityData.data.kill = [
              [row - 1, col + 1],
              [row - 1, col - 1],
            ];
          } else if ((A == 1 || A == 8) && KA == 0 && B != 0) {
            possibilityData.data.killRow = [row - 2];
            possibilityData.data.killCol = [col - 2];
            possibilityData.data.kill = [[row - 1, col - 1]];
          } else if ((A == 1 || A == 8) && KA == 0 && B == 0) {
            possibilityData.data.row = [row - 1];
            possibilityData.data.col = [col + 1];
            possibilityData.data.killRow = [row - 2];
            possibilityData.data.killCol = [col - 2];
            possibilityData.data.kill = [[row - 1, col - 1]];
          } else if ((B == 1 || B == 8) && KB == 0 && A != 0) {
            possibilityData.data.killRow = [row - 2];
            possibilityData.data.killCol = [col + 2];
            possibilityData.data.kill = [[row - 1, col + 1]];
          } else if ((B == 1 || B == 8) && KB == 0 && A == 0) {
            possibilityData.data.row = [row - 1];
            possibilityData.data.col = [col - 1];
            possibilityData.data.killRow = [row - 2];
            possibilityData.data.killCol = [col + 2];
            possibilityData.data.kill = [[row - 1, col + 1]];
          }
          if (A == 0 && B == 0) {
            possibilityData.data.row = [row - 1, row - 1];
            possibilityData.data.col = [col - 1, col + 1];
          } else if (A == 0 && B != 0) {
            possibilityData.data.row = [row - 1];
            possibilityData.data.col = [col - 1];
          } else if (B == 0 && A != 0) {
            possibilityData.data.row = [row - 1];
            possibilityData.data.col = [col + 1];
          }
        }
        // red
        else if (color == 1) {
          possibilityData.data.userId = tableData.player[0]._id;
          if ((D == 2 || D == 5) && (C == 2 || C == 5) && KD == 0 && KC == 0) {
            possibilityData.data.killRow = [row + 2, row + 2];
            possibilityData.data.killCol = [col + 2, col - 2];
            possibilityData.data.kill = [
              [row + 1, col + 1],
              [row + 1, col - 1],
            ];
          } else if ((D == 2 || D == 5) && KD == 0 && C != 0) {
            possibilityData.data.killRow = [row + 2];
            possibilityData.data.killCol = [col - 2];
            possibilityData.data.kill = [[row + 1, col - 1]];
          } else if ((D == 2 || D == 5) && KD == 0 && C == 0) {
            possibilityData.data.row = [row + 1];
            possibilityData.data.col = [col + 1];
            possibilityData.data.killRow = [row + 2];
            possibilityData.data.killCol = [col - 2];
            possibilityData.data.kill = [[row + 1, col - 1]];
          } else if ((C == 2 || C == 5) && KC == 0 && D != 0) {
            possibilityData.data.killRow = [row + 2];
            possibilityData.data.killCol = [col + 2];
            possibilityData.data.kill = [[row + 1, col + 1]];
          } else if ((C == 2 || C == 5) && KC == 0 && D == 0) {
            possibilityData.data.row = [row + 1];
            possibilityData.data.col = [col - 1];
            possibilityData.data.killRow = [row + 2];
            possibilityData.data.killCol = [col + 2];
            possibilityData.data.kill = [[row + 1, col + 1]];
          }
          if (D == 0 && C == 0) {
            possibilityData.data.row = [row + 1, row + 1];
            possibilityData.data.col = [col - 1, col + 1];
          } else if (D == 0 && C != 0) {
            possibilityData.data.row = [row + 1];
            possibilityData.data.col = [col - 1];
          } else if (C == 0 && D != 0) {
            possibilityData.data.row = [row + 1];
            possibilityData.data.col = [col + 1];
          }
        }
        // king
        else if (color == 5 || color == 8) {
          let diceColor = color;
          let killColorKing = diceColor == 8 ? 5 : 8;
          let KillColor = diceColor == 8 ? 2 : 1;
// first row kill
          // 3 4 kill & 1 2 block
          if (
            row == 0 &&
            color == diceColor &&
            (D == KillColor || D == killColorKing) &&
            (C == KillColor || C == killColorKing) &&
            KC == 0 &&
            KD == 0
          ) {
            (possibilityData.data.killRow = [row + 2, row + 2]),
              (possibilityData.data.killCol = [col + 2, col - 2]),
              (possibilityData.data.kill = [
                [row + 1, col + 1],
                [row + 1, col - 1],
              ]);
          }
          // 3 kill & 4 free & 1 2 block
          else if (
            row == 0 &&
            color == diceColor &&
            (C == KillColor || C == killColorKing) &&
            KC == 0 &&
            D == 0
          ) {
            (possibilityData.data.row = [row + 1]),
              (possibilityData.data.col = [col - 1]),
              (possibilityData.data.killRow = [row + 2]),
              (possibilityData.data.killCol = [col + 2]),
              (possibilityData.data.kill = [[row + 1, col + 1]]);
          }
        //   3 kill & 4 block
          else if (
            row == 0 &&
            color == diceColor &&
            (C == KillColor || C == killColorKing) &&
            KC == 0 &&
            D != 0
          ) {
            (possibilityData.data.row = []),
              (possibilityData.data.col = []),
              (possibilityData.data.killRow = [row + 2]),
              (possibilityData.data.killCol = [col + 2]),
              (possibilityData.data.kill = [[row + 1, col + 1]]);
          }
          // 4 kill & 3 free  & 1 2 block
          else if (
            row == 0 &&
            color == diceColor &&
            (D == KillColor || D == killColorKing) &&
            C == 0 &&
            KD == 0
          ) {
            (possibilityData.data.row = [row + 1]),
              (possibilityData.data.col = [col + 1]),
              (possibilityData.data.killRow = [row + 2]),
              (possibilityData.data.killCol = [col - 2]),
              (possibilityData.data.kill = [[row + 1, col - 1]]);
          }
        // 4 kill & 3 block  & 1 2 block
          else if (
            row == 0 &&
            color == diceColor &&
            (D == KillColor || D == killColorKing) &&
            C != 0 &&
            KD == 0
          ) {
            (possibilityData.data.row = []),
              (possibilityData.data.col = []),
              (possibilityData.data.killRow = [row + 2]),
              (possibilityData.data.killCol = [col - 2]),
              (possibilityData.data.kill = [[row + 1, col - 1]]);
          }
          // last row kill
          // 1 2  kill 3 4 block
          else if (
            row == 7 &&
            color == diceColor &&
            (A == KillColor || A == killColorKing) &&
            (B == KillColor || B == killColorKing) &&
            KB == 0 &&
            KA == 0
          ) {
            (possibilityData.data.killRow = [row - 2, row - 2]),
              (possibilityData.data.killCol = [col + 2, col - 2]),
              (possibilityData.data.kill = [
                [row - 1, col + 1],
                [row - 1, col - 1],
              ]);
          }
          // 1 kill & 2 free &  3 4 block
          else if (
            row == 7 &&
            color == diceColor &&
            (A == KillColor || A == killColorKing) &&
            B == 0 &&
            KA == 0
          ) {
            (possibilityData.data.row = [row - 1]),
              (possibilityData.data.col = [col + 1]),
              (possibilityData.data.killRow = [row - 2]),
              (possibilityData.data.killCol = [col - 2]),
              (possibilityData.data.kill = [[row - 1, col - 1]]);
          }
          // 2  kill & 1 free &  3 4 block
          else if (
            row == 7 &&
            color == diceColor &&
            A == 0 &&
            (B == KillColor || B == killColorKing) &&
            KB == 0
          ) {
            (possibilityData.data.row = [row - 1]),
              (possibilityData.data.col = [col - 1]),
              (possibilityData.data.killRow = [row - 2]),
              (possibilityData.data.killCol = [col + 2]),
              (possibilityData.data.kill = [[row - 1, col + 1]]);
          }

          //top left corner
          else if (
            row == 0 &&
            col == 0 &&
            color == diceColor &&
            row == 0 &&
            col == 0 &&
            (C == KillColor || C == killColorKing) &&
            KC == 0
          ) {
            (possibilityData.data.killRow = [row + 2]),
              (possibilityData.data.killCol = [col + 2]),
              (possibilityData.data.kill = [[row + 1, col + 1]]);
          }
          //top right corner
          else if (
            row == 0 &&
            col == 6 &&
            color == diceColor &&
            row == 0 &&
            col == 6 &&
            (D == KillColor || D == killColorKing) &&
            KD == 0
          ) {
            (possibilityData.data.killRow = [row + 2]),
              (possibilityData.data.killCol = [col - 2]),
              (possibilityData.data.kill = [[row + 1, col - 1]]);
          }
          //bottom left corner
          else if (
            row == 7 &&
            col == 1 &&
            color == diceColor &&
            row == 7 &&
            col == 1 &&
            (B == KillColor || B == killColorKing) &&
            KB == 0
          ) {
            (possibilityData.data.killRow = [row - 2]),
              (possibilityData.data.killCol = [col + 2]),
              (possibilityData.data.kill = [[row - 1, col + 1]]);
          }
          //bottom right corner
          else if (
            row == 7 &&
            col == 7 &&
            color == diceColor &&
            row == 7 &&
            col == 7 &&
            (A == KillColor || A == killColorKing) &&
            KA == 0
          ) {
            possibilityData.data.killRow = [row - 2];
            possibilityData.data.killCol = [col - 2];
            possibilityData.data.kill = [[row - 1, col - 1]];
          }

          // first row
          else if (row - 1 < 0) {
            if (D == 0 && C == 0) {
              possibilityData.data.row = [row + 1, row + 1];
              possibilityData.data.col = [col + 1, col - 1];
            } else if (C != 0 && D == 0) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col - 1];
            } else if (C == 0 && D != 0) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col + 1];
            }
          }
          // last row
          else if (row == 7) {
            if (A == 0 && B == 0) {
              possibilityData.data.row = [row - 1, row - 1];
              possibilityData.data.col = [col - 1, col + 1];
            } else if (A == 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col - 1];
            } else if (A == 0 && B != 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col - 1];
            } else if (A != 0 && B == 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col + 1];
            }
          }
          //all
          else if (A == 0 && B == 0 && D == 0 && C == 0) {
            possibilityData.data.row = [row - 1, row - 1, row + 1, row + 1];
            possibilityData.data.col = [col + 1, col - 1, col + 1, col - 1];
          }
          //1 2 3 kill 4 block
          else if (
            color == diceColor &&
            (A == KillColor || A == killColorKing) &&
            (B == KillColor || B == killColorKing) &&
            (C == KillColor || C == killColorKing) &&
            KA == 0 &&
            KB == 0 &&
            KC == 0
          ) {
            possibilityData.data.killRow = [row - 2, row - 2, row + 2];
            possibilityData.data.killCol = [col - 2, col + 2, col + 2];
            possibilityData.data.kill = [
              [row - 1, col - 1],
              [row - 1, col + 1],
              [row + 1, col + 1],
            ];
            if (D == 0 || D == null) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col - 1];
            }
          }

          //2 3 4 kill
          else if (
            color == diceColor &&
            (D == KillColor || D == killColorKing) &&
            (B == KillColor || B == killColorKing) &&
            (C == KillColor || C == killColorKing) &&
            KD == 0 &&
            KB == 0 &&
            KC == 0
          ) {
            (possibilityData.data.killRow = [row + 2, row - 2, row + 2]),
              (possibilityData.data.killCol = [col - 2, col + 2, col + 2]),
              (possibilityData.data.kill = [
                [row + 1, col - 1],
                [row - 1, col + 1],
                [row + 1, col + 1],
              ]);

            if (A == 0 || A == null) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col - 1];
            }
          }

          //3 4 1 kill
          else if (
            color == diceColor &&
            (A == KillColor || A == killColorKing) &&
            (D == KillColor || D == killColorKing) &&
            (C == KillColor || C == killColorKing) &&
            KA == 0 &&
            KD == 0 &&
            KC == 0
          ) {
            possibilityData.data.killRow = [row + 2, row + 2, row - 2];
            possibilityData.data.killCol = [col + 2, col - 2, col - 2];
            possibilityData.data.kill = [
              [row + 1, col + 1],
              [row + 1, col - 1],
              [row - 1, col - 1],
            ];
            if (B == 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col + 1];
            }
          }

          //4 1 2 kill
          else if (
            color == diceColor &&
            (A == KillColor || A == killColorKing) &&
            (B == KillColor || B == killColorKing) &&
            (D == KillColor || D == killColorKing) &&
            KA == 0 &&
            KD == 0 &&
            KB == 0
          ) {
            possibilityData.data.killRow = [row + 2, row - 2, row - 2];
            possibilityData.data.killCol = [col - 2, col - 2, col + 2];
            possibilityData.data.kill = [
              [row + 1, col - 1],
              [row - 1, col - 1],
              [row - 1, col + 1],
            ];
            if (C == 0) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col + 1];
            }
          }

          // 2-2 kill
          // 3 4 kill
          else if (
            color == diceColor &&
            (D == KillColor || D == killColorKing) &&
            (C == KillColor || C == killColorKing) &&
            KC == 0 &&
            KD == 0
          ) {
            possibilityData.data.killRow = [row + 2, row + 2];
            possibilityData.data.killCol = [col + 2, col - 2];
            possibilityData.data.kill = [
              [row + 1, col + 1],
              [row + 1, col - 1],
            ];
            if (A == 0 && B != 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col - 1];
            } else if (A != 0 && B == 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col + 1];
            } else if (A == 0 && B == 0) {
              possibilityData.data.row = [row - 1, row - 1];
              possibilityData.data.col = [col - 1, col + 1];
            }
          }
          // 1 3 kill
          else if (
            color == diceColor &&
            (A == KillColor || A == killColorKing) &&
            (C == KillColor || C == killColorKing) &&
            KA == 0 &&
            KC == 0
          ) {
            possibilityData.data.killRow = [row - 2, row + 2];
            possibilityData.data.killCol = [col - 2, col + 2];
            possibilityData.data.kill = [
              [row - 1, col - 1],
              [row + 1, col + 1],
            ];

            if (B == 0 && D != 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col + 1];
            } else if (B != 0 && D == 0) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col - 1];
            } else if (B == 0 && D == 0) {
              possibilityData.data.row = [row + 1, row - 1];
              possibilityData.data.col = [col - 1, col + 1];
            }
          }
          // 1 2  kill
          else if (
            color == diceColor &&
            (A == KillColor || A == killColorKing) &&
            (B == KillColor || B == killColorKing) &&
            KB == 0 &&
            KA == 0
          ) {
            possibilityData = {
              eventName: EVENT_NAME.CHECK_POSSIBILITY,
              data: {
                killRow: [row - 2, row - 2],
                killCol: [col + 2, col - 2],
                kill: [
                  [row - 1, col + 1],
                  [row - 1, col - 1],
                ],
                userId:
                  color == 5
                    ? tableData.player[1]._id
                    : tableData.player[0]._id,
              },
            };
            if (D != 0 && C == 0) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col + 1];
            } else if (D == 0 && C != 0) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col - 1];
            } else if (D == 0 && C == 0) {
              possibilityData.data.row = [row + 1, row + 1];
              possibilityData.data.col = [col - 1, col + 1];
            }
          }
          // 2 3 kill
          else if (
            color == diceColor &&
            (B == KillColor || B == killColorKing) &&
            (C == KillColor || C == killColorKing) &&
            KB == 0 &&
            KC == 0
          ) {
            possibilityData.data.killRow = [row - 2, row + 2];
            possibilityData.data.killCol = [col + 2, col + 2];
            possibilityData.data.kill = [
              [row - 1, col + 1],
              [row + 1, col + 1],
            ];
            if (A == 0 && D != 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col - 1];
            } else if (A != 0 && D == 0) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col - 1];
            } else if (A == 0 && D == 0) {
              possibilityData.data.row = [row - 1, row + 1];
              possibilityData.data.col = [col - 1, col - 1];
            }
          }
          // 2 4 kill
          else if (
            color == diceColor &&
            (B == KillColor || B == killColorKing) &&
            (D == KillColor || D == killColorKing) &&
            KB == 0 &&
            KD == 0
          ) {
            possibilityData.data.killRow = [row - 2, row + 2];
            possibilityData.data.killCol = [col + 2, col - 2];
            possibilityData.data.kill = [
              [row - 1, col + 1],
              [row + 1, col + 1],
            ];

            if (A == 0 && C != 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col - 1];
            } else if (A != 0 && C == 0) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col + 1];
            } else if (A == 0 && C == 0) {
              possibilityData.data.row = [row + 1, row - 1];
              possibilityData.data.col = [col + 1, col - 1];
            }
          }
          //1 4 kill
          else if (
            color == diceColor &&
            (A == KillColor || A == killColorKing) &&
            (D == KillColor || D == killColorKing) &&
            KA == 0 &&
            KD == 0
          ) {
            possibilityData.data.killRow = [row - 2, row + 2];
            possibilityData.data.killCol = [col - 2, col - 2];
            possibilityData.data.kill = [
              [row - 1, col - 1],
              [row + 1, col - 1],
            ];

            if (B == 0 && C != 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col + 1];
            } else if (B != 0 && C == 0) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col + 1];
            } else if (B == 0 && C == 0) {
              possibilityData.data.row = [row - 1, row + 1];
              possibilityData.data.col = [col + 1, col + 1];
            }
          }
          //1-1 kill
          //1 kill
          else if (
            color == diceColor &&
            (A == KillColor || A == killColorKing) &&
            KA == 0
          ) {
            possibilityData.data.killRow = [row - 2];
            possibilityData.data.killCol = [col - 2];
            possibilityData.data.kill = [[row - 1, col - 1]];

            if (B == 0 && D == 0 && C == 0) {
              possibilityData.data.row = [row - 1, row + 1, row + 1];
              possibilityData.data.col = [col + 1, col + 1, col - 1];
            } else if ((D != 0 || D == null) && (C != 0 || C == null)) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col + 1];
            } else if (B != 0 && D != 0 && C == 0) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col + 1];
            } else if (
              (B != 0 || B == null) &&
              D == 0 &&
              (C != 0 || C == null)
            ) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col - 1];
            } else if (B == 0 && D != 0 && C == 0) {
              possibilityData.data.row = [row + 1, row - 1];
              possibilityData.data.col = [col + 1, col + 1];
            } else if (B == 0 && D == 0 && C != 0) {
              possibilityData.data.row = [row + 1, row - 1];
              possibilityData.data.col = [col - 1, col + 1];
            } else if (B != 0 && D == 0 && C == 0) {
              possibilityData.data.row = [row + 1, row + 1];
              possibilityData.data.col = [col + 1, col - 1];
            }
          }
          // 2 kill
          else if (
            color == diceColor &&
            (B == KillColor || B == killColorKing) &&
            KB == 0
          ) {
            possibilityData.data.killRow = [row - 2];
            possibilityData.data.killCol = [col + 2];
            possibilityData.data.kill = [[row - 1, col + 1]];
            if (A == 0 && D == 0 && C == 0) {
              possibilityData.data.row = [row - 1, row + 1, row + 1];
              possibilityData.data.col = [col - 1, col + 1, col - 1];
            } else if (A == 0 && D != 0 && C != 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col - 1];
            } else if (A != 0 && D != 0 && C == 0) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col + 1];
            } else if (A != 0 && D == 0 && C != 0) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col - 1];
            } else if (A == 0 && D != 0 && C == 0) {
              possibilityData.data.row = [row + 1, row - 1];
              possibilityData.data.col = [col + 1, col - 1];
            } else if (A == 0 && D == 0 && C != 0) {
              possibilityData.data.row = [row + 1, row - 1];
              possibilityData.data.col = [col - 1, col - 1];
            } else if (A != 0 && D == 0 && C == 0) {
              possibilityData.data.row = [row + 1, row + 1];
              possibilityData.data.col = [col + 1, col - 1];
            }
          }
          //3 kill
          else if (
            color == diceColor &&
            (C == KillColor || C == killColorKing) &&
            KC == 0
          ) {
            possibilityData.data.killRow = [row + 2];
            possibilityData.data.killCol = [col + 2];
            possibilityData.data.kill = [[row + 1, col + 1]];

            if (A == 0 && D == 0 && B == 0) {
              possibilityData.data.row = [row - 1, row - 1, row + 1];
              possibilityData.data.col = [col - 1, col + 1, col - 1];
            } else if (A != 0 && D != 0 && B != 0) {
              possibilityData.data.row = [row + 2];
              possibilityData.data.col = [col + 2];
            } else if (A == 0 && D != 0 && B != 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col - 1];
            } else if (A != 0 && D != 0 && B == 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col + 1];
            } else if (
              (A == null || A != 0) &&
              D == 0 &&
              (B == null || B != 0)
            ) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col - 1];
            } else if (A == 0 && D != 0 && B == 0) {
              possibilityData.data.row = [row - 1, row - 1];
              possibilityData.data.col = [col + 1, col - 1];
            } else if (A == 0 && D == 0 && B != 0) {
              possibilityData.data.row = [row + 1, row - 1];
              possibilityData.data.col = [col - 1, col - 1];
            } else if (A != 0 && D == 0 && B == 0) {
              possibilityData.data.row = [row - 1, row + 1];
              possibilityData.data.col = [col + 1, col - 1];
            }
          }
          // 4 kill
          else if (
            color == diceColor &&(D == KillColor || D == killColorKing) &&
            KD == 0
          ) {
            possibilityData.data.killRow = [row + 2];
            possibilityData.data.killCol = [col - 2];
            possibilityData.data.kill = [[row + 1, col - 1]];

            if (A == 0 && C == 0 && B == 0) {
              possibilityData.data.row = [row - 1, row - 1, row + 1];
              possibilityData.data.col = [col - 1, col + 1, col + 1];
            } else if (
              A == 0 &&
              (C != 0 || C == null) &&
              (B != 0 || B == null)
            ) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col - 1];
            } else if (A != 0 && C != 0 && B == 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col + 1];
            } else if (A != 0 && C == 0 && B != 0) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col + 1];
            } else if (A == 0 && C != 0 && B == 0) {
              possibilityData.data.row = [row - 1, row - 1];
              possibilityData.data.col = [col + 1, col - 1];
            } else if (A == 0 && C == 0 && B != 0) {
              possibilityData.data.row = [row + 1, row - 1];
              possibilityData.data.col = [col + 1, col - 1];
            } else if (A != 0 && C == 0 && B == 0) {
              possibilityData.data.row = [row - 1, row + 1];
              possibilityData.data.col = [col + 1, col + 1];
            }
          }

          // first col kill
          else if (
            color == diceColor &&
            (B == KillColor || B == killColorKing) &&
            (C == KillColor || C == killColorKing)
          ) {
            if (KB == 0 && KC == 0) {
              possibilityData.data.row = [];
              possibilityData.data.col = [];
              possibilityData.data.killRow = [row - 2, row + 2];
              possibilityData.data.killCol = [col + 2, col + 2];
              possibilityData.data.kill = [
                [row - 1, col + 1],
                [row + 1, col + 1],
              ];
            } else if (C == 0 && KB == 0) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col + 1];
              possibilityData.data.killRow = [row - 2];
              possibilityData.data.killCol = [col + 2];
              possibilityData.data.kill = [[row - 1, col + 1]];
            }
            if (KC == 0 && B == 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col + 1];
              possibilityData.data.killRow = [row + 2];
              possibilityData.data.killCol = [col + 2];
              possibilityData.data.kill = [[row + 1, col + 1]];
            }
          }
          // with out kill
          else {
            if (A == 0 && B == 0 && D == 0 && C == 0) {
              possibilityData.data.row = [row - 1, row - 1, row + 1, row + 1];
              possibilityData.data.col = [col + 1, col - 1, col + 1, col - 1];
            } else if (A != 0 && B == 0 && D == 0 && C == 0) {
              possibilityData.data.row = [row - 1, row + 1, row + 1];
              possibilityData.data.col = [col + 1, col + 1, col - 1];
            } else if (A == 0 && B != 0 && D == 0 && C == 0) {
              possibilityData.data.row = [row - 1, row + 1, row + 1];
              possibilityData.data.col = [col - 1, col + 1, col - 1];
            } else if (A == 0 && B == 0 && D != 0 && C == 0) {
              possibilityData.data.row = [row - 1, row - 1, row + 1];
              possibilityData.data.col = [col - 1, col + 1, col + 1];
            } else if (A == 0 && B == 0 && D == 0 && C != 0) {
              possibilityData.data.row = [row - 1, row - 1, row + 1];
              possibilityData.data.col = [col - 1, col + 1, col - 1];
            } else if (A == 0 && B == 0 && D != 0 && C != 0) {
              possibilityData.data.row = [row - 1, row - 1];
              possibilityData.data.col = [col - 1, col + 1];
            } else if (A != 0 && B != 0 && D == 0 && C == 0) {
              possibilityData.data.row = [row + 1, row + 1];
              possibilityData.data.col = [col - 1, col + 1];
            } else if (A == 0 && B != 0 && D == 0 && C != 0) {
              possibilityData.data.row = [row - 1, row + 1];
              possibilityData.data.col = [col - 1, col - 1];
            } else if (A != 0 && B == 0 && D != 0 && C == 0) {
              possibilityData.data.row = [row - 1, row + 1];
              possibilityData.data.col = [col + 1, col + 1];
            } else if (A == 0 && B != 0 && D != 0 && C == 0) {
              possibilityData.data.row = [row - 1, row + 1];
              possibilityData.data.col = [col - 1, col + 1];
            } else if (A != 0 && B == 0 && D == 0 && C != 0) {
              possibilityData.data.row = [row - 1, row + 1];
              possibilityData.data.col = [col + 1, col - 1];
            } else if (A == 0 && B != 0 && D != 0 && C != 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col - 1];
            } else if (A != 0 && B == 0 && D != 0 && C != 0) {
              possibilityData.data.row = [row - 1];
              possibilityData.data.col = [col + 1];
            } else if (A != 0 && B != 0 && D == 0 && C != 0) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col - 1];
            } else if (A != 0 && B != 0 && D != 0 && C == 0) {
              possibilityData.data.row = [row + 1];
              possibilityData.data.col = [col + 1];
            }
          }
        }
        let validatePossibilityData = await resPossibilityValidation(
          possibilityData
          );
        validatePossibilityData
          ? Event.sendToRoom(tableData._id, validatePossibilityData)
          : null;
      }
    }
  } catch (error) {
    logger.error(`CATCH ERROR IN checkPOssibility : ${error}`);
  }
};
export default checkPOssibility;
