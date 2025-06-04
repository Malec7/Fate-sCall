// This is the backend (Node.JS Server)

// Import the modules
const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./database')
const session = require('express-session')

// Initialize the Server
const app = express()

// Set the port for the server
const serverPort = 4000

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.log("Error connecting to DB : " + err)
        return
    }

    console.log("Connected to database!")
})

// Middlewares
app.use(bodyParser.urlencoded({ extended: false })) // Parses the body of the request as URL encoded data
app.use(express.json()) // Parses the body of the request as JSON
app.use("/", express.static("www")) // Serves the static files from the www folder

// Session Middleware settings.
app.use(session({
    secret: "mycoolsecretkey", // This is the secret key used to sign the session ID cookie.
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 hour in milliseconds
    }
}))

app.get("/checkLogin", (req, res) => {
    const player = req.session.playerID
    if (player)
        res.status(200).json({"logged": true})
    else
        res.status(401).json({"logged": false})
})

/// Endpoint /register - Receives a POST request with the username and password and registers the player.
app.post("/register", (req, res) => {
    function CreatePlayer(){
        connection.query("INSERT INTO player (player_username, player_password) VALUES (?,?)", [receivedUsername, receivedPassword, 0],
            function (err, rows, fields) {
                if (err){
                    res.send("Error: " + err);
                    // res.redirect("../index.html")
                    return;
                }

                console.log("Player created with ID: " + rows.insertId);
                CreateTeam(rows.insertId)
            }
        )
    }

    function CreateTeam(playerID){
        connection.query("INSERT INTO player_unit (player_id, slot_id) VALUES (?, 1), (?, 2), (?, 3), (?, 4)", [playerID,playerID,playerID,playerID],
            function (err, unitRows, fields) {
                if (err){
                    res.send("Error: " + err);
                    // res.redirect("../index.html")
                    return;
                }

                connection.query("INSERT INTO player_blessing (player_id) VALUES (?)", [playerID],
                    function (err, blessingRows, fields) {
                        if (err){
                            res.send("Error: " + err);
                            // res.redirect("../index.html")
                            return;
                        }        
                })

                req.session.username = receivedUsername
                req.session.playerID = playerID

                res.status(200).json({
                    "message": "Registered Successfully!",
                    "redirect": "/mainMenu.html"
                });
            }
        )
    }

    var receivedUsername = req.body.username
    var receivedPassword = req.body.password
    var checkpassword = req.body.checkpassword
    if (receivedPassword == checkpassword) {
        // Password and Check Password match. Continue with the register.
        CreatePlayer()
    }else{
        // They don't match. Tell the user.
        res.send("The password and check password don't match")
    }  
});

// Endpoint /login - Receives a POST request with the username and password and logs the player in.
app.post("/login", (req, res) => {
    // First, check if the username and password are sent. If not, return an error.
    if (!req.body.username || !req.body.password){
        res.status(400).send({
            "message": "Missing username or password"
        })
        return
    }

    // Get the username and password from the request.
    var receivedUsername = req.body.username
    var receivedPassword = req.body.password

    // Execute query to check if the player exists.
    connection.query("SELECT * FROM player WHERE player_username = ? AND player_password = ?", [receivedUsername, receivedPassword],
        function (err, rows, fields) {
            // If there is an error, return the error message.
            if (err){
                res.status(500).send({
                    "message": err
                })
                return
            }          
            if (rows.length == 0){
                // If there are no rows, return a 404 error since no player was found.
                res.status(404).json({
                    "message": "Player not found"
                })
            }else{
                // If there is a row, set the session variable for the player.
                req.session.username = receivedUsername
                req.session.playerID = rows[0].player_id
                
                res.status(200).json({
                    "username": req.session.username,
                    "message": "Logged in successfully. Welcome " + req.session.username
                })
            }
        }
    )

})

// Endpoint /counter - Increments a counter in the session. (Just testing the session)
app.get("/counter", (req, res) => {
    if (req.session.count)
        req.session.count++
    else
        req.session.count = 1
    res.send("Counter: " + req.session.count);
})

app.get("/checkMatch", (req, res) => {
    //check if the user exists
    if(!req.session.username){
        res.status(401).json({message: "User not logged in"});
        return;
    }

    //check if any match exists
    connection.query("SELECT * FROM game_state WHERE game_state = 0 AND (game_ply1_id = ? OR game_ply2_id = ?)", [req.session.playerID, req.session.playerID],
    function(err, rows, fields){
        if(err){
            res.status(500).json({"message": err});
            return;
        }

        if (rows.length == 0){
            res.status(404).json(
                {
                    "message": "You are not in a match",
                    "state": "NOT_IN_MATCH",
                    "username": req.session.username,
                }
            );
        }else{
            if (rows[0].game_ply2_id == null){
                // Means that there is no opponent yet.
                res.status(404).json(
                    {
                        "message": "You are waiting for a game",
                        "state": "WAITING_MATCH",
                        "username": req.session.username,
                    }
                );
            }else{
                req.session.matchID = rows[0].game_id
                res.status(404).json(
                    {
                        "message": "You are already in game",
                        "state": "IN_GAME"
                    }
                );
            }
        }
    });
})

app.get("/getPlayerUnits", (req, res) => {
    connection.query("SELECT * FROM player_unit INNER JOIN unit ON unit.unit_id = player_unit.unit_id WHERE player_id = ?", [req.session.playerID], function (err, unitRows, fields) {
        if (err) {
            return res.status(500).send(err);
        }

        connection.query("SELECT * FROM blessing INNER JOIN player_blessing ON blessing.blessing_id = player_blessing.blessing_id WHERE player_id = ?", [req.session.playerID], function (err, blessingRows, fields) {
            if (err) {
                return res.status(500).send(err);
            }

            res.status(200).json({
                units: unitRows,
                blessing: blessingRows[0]
            })
        });
    });
})

// Endpoint /logout - Logs the user out by destroying the session.
app.get("/logout", (req, res) => {
    // Destroy the session. Other way of doing it is to set the session to null.
    req.session.destroy();
    res.send("Logged out successfully! <br/><a href='/login.html'>Login</a>");
})

app.post("/searchMatch", (req, res) => {
    console.log("Checking team for player " + req.session.playerID)

    function CheckPlayerTeam(){
    // Check if the player has selected a team
        connection.query("SELECT * FROM player_unit WHERE player_id = ?", [req.session.playerID], function (err, rows, fields) {
            if (err) {
                return res.status(500).send(err);
            }
            console.log(rows)
            if (rows.length < 4 || !rows[0].unit_id || !rows[1].unit_id || !rows[2].unit_id || !rows[3].unit_id) {
                return res.status(400).json({ message: "Please fully select your team and blessing before searching for a match." });
            }
            // Check if the team is fully selected
            CheckPlayerBlessing()
        });
    }

    function CheckPlayerBlessing(){
        connection.query("SELECT * FROM player_blessing WHERE player_id = ?", [req.session.playerID], function (err, rows, fields) {
        if (err) {
            return res.status(500).send(err);
        }

        if (rows.length == 0 || !rows[0].blessing_id){
            return res.status(404).json({"message": "No blessing defined."})
        }

        SearchMatch() 
        });
    }

    function ResetPlayerUnits(playerID) {
        console.log("Resetting player units for player ID: " + playerID);
        connection.query("SELECT * from player_unit WHERE player_id = ?", [playerID], 
            function (err, playerUnits, fields) {
                if (err){
                    console.log("Error resetting player units: ", err);
                    return;
                }

                playerUnits.forEach(unit => { 
                    connection.query("SELECT * from unit WHERE unit_id = ?", [unit.unit_id],
                        function (err, unitData, fields) {
                            if (err){
                                console.log("Error resetting player units: ", err);
                                return;
                            }

                            connection.query("UPDATE player_unit SET curr_unit_hp = ?, curr_unit_atk = ?, curr_unit_heal = ? WHERE player_unit_id = ?",
                                [unitData[0].unit_hp, unitData[0].unit_atk, unitData[0].unit_heal, unit.player_unit_id],
                                function (err, rows, fields) {
                                    if (err){
                                        console.log("Error resetting player units: ", err);
                                        return;
                                    }

                                    console.log("Player unit " + unit.player_unit_id + " reset to default values.");                            
                                }
                            )
                        }
                    )
                })

                // Call the function after 3 seconds to apply blessing effects
                setTimeout(() => {
                    applyBlessingEffects(playerID);
                }, 3000);
            }
        )
    }

    function SearchMatch(){
        // Existing logic to search for a match
            connection.query("SELECT game_id, game_ply1_id FROM game_state WHERE game_ply1_id IS NOT NULL AND game_ply2_id IS NULL", function (err, rows, fields) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                if (rows.length > 0) {
                    req.session.matchID = rows[0].game_id;
                    connection.query("UPDATE game_state SET game_ply2_id = ? WHERE game_id = ?",
                        [req.session.playerID, req.session.matchID],
                        function (err, updatedRows, fields) {
                            if (err){
                                res.send(err);
                                return;
                            }

                            ResetPlayerUnits(req.session.playerID);
                            ResetPlayerUnits(rows[0].game_ply1_id);
                            res.json({ message: "Match found!" });
                        }
                    );
                } else {
                    connection.query("INSERT INTO game_state (game_ply1_id) VALUES (?)",
                        [req.session.playerID],
                        function (err, rows, fields) {
                            if (err){
                                res.send(err);
                                return;
                            }

                            res.json({ message: "Match created!" });
                        }
                    );
                }
            });
    }
    
    CheckPlayerTeam()
});

app.post("/quitSearch", (req, res) => {
    function GetMatchID(){
        connection.query("select * from game_state WHERE game_ply1_id = ?",
            [req.session.playerID],
            function (err, rows, fields){
                if (err){
                    res.send(err)
                    return
                }

                req.session.matchID = rows[0].game_id
                DeleteGame()
            }
        )
    }

    function DeleteGame(){
        console.log("delete game with id " + req.session.matchID)
        connection.query("DELETE FROM Fates_sitacresup.game_state WHERE (game_id = ?) AND (game_ply1_id = ?)",
            [req.session.matchID, req.session.playerID],
            function (err, rows, fields) {
                if (err){
                    res.send(err)
                    return
                }
    
                req.session.matchID = undefined
                res.json({
                    "message": "Match Search Canceled!"
                })
            }
        )

    }

    if (!req.session.matchID)
        GetMatchID()
    else
        DeleteGame()

})

app.post("/teamSelectPage", (req, res) => {
    res.json({
        "redirect": "/teamSelect.html"
    });
});

app.get("/getTeamState", (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ message: "User  not logged in" });
    }

    const playerId = req.session.playerID;
    connection.query("SELECT * FROM player_unit INNER JOIN unit ON unit.unit_id = player_unit.unit_id WHERE player_id = ?", [playerId], (err, unitRows) => {
        if (err) {
            return res.status(500).json({ message: err });
        }

        connection.query("SELECT * FROM Fates_sitacresup.player_blessing INNER JOIN blessing ON player_blessing.blessing_ID = blessing.blessing_id WHERE player_id = ?", [playerId], (err, blessingRows) => {
            if (err) {
                return res.status(500).json({ message: err });
            }

            console.log(unitRows)
            const responseData = {
                username: req.session.username,
                units: unitRows,
                blessing: blessingRows[0]?.blessing_name || "",
                history: []
            };

            res.status(200).json(responseData);
        });
    });
});

app.get("/slot/:slotId/setUnit/:unitId/", (req, res) => {
    if (!req.session.playerID) {
        return res.json({"message": "Not logged in"});
    }

    const unitId = req.params.unitId;
    const slotId = req.params.slotId;

    console.log("Set unit " + unitId + " on slot " + slotId + " for player " + req.session.playerID);


    connection.query("SELECT unit_type_id FROM unit WHERE unit_id = ?", [unitId], (err, unitRows) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        if (unitRows.length === 0) {
            return res.status(404).json({ message: "Unit not found" });
        }

        const unitTypeId = unitRows[0].unit_type_id;

        if (!isValidUnitSlot(slotId, unitTypeId)) {
            return res.status(400).json({ message: "This unit type cannot be assigned to the selected slot." });
        }

        connection.query("SELECT unit_id, unit_name FROM unit WHERE unit_id = ?", [unitId], (err, unitRows) => {
           if (err) {
               return res.status(500).json({ message: err });
           }
           if (unitRows.length === 0) {
               return res.status(404).json({ message: "Unit not found" });
           }
           // Update the player's unit
           connection.query("UPDATE player_unit SET unit_id = ? WHERE player_id = ? AND slot_id = ?", [unitId, req.session.playerID, slotId], (err, rows) => {
               if (err) {
                   console.log(err);
               }
               console.log("Affected rows: ", rows.affectedRows);
               res.status(200).json(unitRows[0]); 
           });
       });
    });
});

function isValidUnitSlot(slotID, unitTypeId) {
    if (slotID == 1) {
        return unitTypeId == 1;
    } else if (slotID == 4) {
        return unitTypeId == 2;
    } else {
        return unitTypeId == 3;
    }
}

app.get("/setBlessing/:blessingId/", (req, res) => {
    if (!req.session.playerID) {
        return res.json({"message": "Not logged in"})
    }

    const blessingId = req.params.blessingId;
    console.log("Set blessing " + blessingId + " for player" + req.session.playerID)
    connection.query("SELECT * FROM blessing WHERE blessing_id = ?", [blessingId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: "Blessing not found" });
        }

        connection.query("UPDATE player_blessing SET blessing_id = ? WHERE player_id = ?", [blessingId, req.session.playerID],
            function (err, rows, fields) {
                if (err){
                    console.log(err)
                }

                console.log("Affected rows: ", rows.affectedRows);
            }
        )

        res.status(200).json(rows[0]);
    });
});

app.get("/getAvailableUnits", (req, res) => {
    connection.query("SELECT unit_id, unit_name FROM unit", (err, units) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        connection.query("SELECT * FROM blessing", (err, blessings) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.status(200).json({ units, blessings });
        });
    });
});


app.get("/getMatchState", (req, res) => {
	if (!req.session.username) {
		res.status(401).json({ message: "User not logged in" });
		return;
	}

	function GetMatchState() {
		connection.query("SELECT * FROM game_state WHERE game_id = ?", [req.session.matchID], (err, gameRows) => {
			if (err) {
				res.status(500).json({ message: err });
				return;
			}

			if (gameRows.length === 0) {
				res.status(404).json({ message: "Match not found" });
				return;
			}

			const gameState = gameRows[0];

		connection.query(`SELECT pu.*, u.unit_name FROM player_unit pu JOIN unit u ON pu.unit_id = u.unit_id WHERE pu.player_id = ? OR pu.player_id = ?`,[gameState.game_ply1_id, gameState.game_ply2_id],
        (err, unitRows) => {
        if (err) {
        res.status(500).json({ message: err });
        return;
        }

        const playerUnits = {
        player1: [],
        player2: []
        };

       unitRows.forEach(unit => {
       const side = unit.player_id === gameState.game_ply1_id ? 'player1' : 'player2';

        playerUnits[side].push({
          unit_id: unit.unit_id,
          curr_unit_hp: unit.curr_unit_hp,
          curr_unit_atk: unit.curr_unit_atk,
          curr_unit_heal: unit.curr_unit_heal,
          slot_id: unit.slot_id,
          player_unit_id: unit.player_unit_id,
          unit_name: unit.unit_name, 
          player_unit: (unit.player_id === req.session.playerID)
        });
      });

				const currentTurn = gameState.game_turn === 1 ? "Player 1" : "Player 2";

				res.status(200).json({
					message: "Match state retrieved successfully.",
					game_state: {
						current_turn: currentTurn,
						player_units: playerUnits,
						game_status: gameState.game_state, // 1 = game over
						winner_id: gameState.game_winner,
						loser_id: gameState.game_loser,
						player_id: req.session.playerID

					}
				});
			});
		});
	}

	function GetMatchID() {
		connection.query("SELECT game_id FROM game_state WHERE game_ply1_id = ? OR game_ply2_id = ?", [req.session.playerID, req.session.playerID],
			function (err, rows) {
				if (err) {
					res.status(500).json({ message: err });
					return;
				}
				if (rows.length == 0) {
					res.status(404).json({ message: "Not in a match" });
					return;
				}
				req.session.matchID = rows[0].game_id;
				GetMatchState();
			}
		);
	}

	if (!req.session.matchID)
		GetMatchID();
	else
		GetMatchState();
});
 
app.put("/attack", (req, res) => {
    if (!req.session.username) {
        res.status(401).json({ message: "User  not logged in" });
        return;
    }

    const attackingUnits = req.body.attackingUnits;
    const playerID = req.session.playerID;
    var player1ID
    var player2ID

    console.log(attackingUnits)

    // Check if all units have chosen a target
    if (attackingUnits.length === 0) {
        return res.status(400).json({ message: "No attacking units provided." });
    }

    function CheckIfIsPlayerTurn() {
        connection.query("SELECT game_turn, game_ply1_id, game_ply2_id FROM game_state WHERE game_id = ?", [req.session.matchID], (err, rows) => {
            if (err) {
                res.status(500).json({ message: err });
                return;
            }
    
            if (rows.length === 0) {
                res.status(404).json({ message: "Game not found" });
                return;
            }
    
            const currentTurn = rows[0].game_turn;
            player1ID = rows[0].game_ply1_id;
            player2ID = rows[0].game_ply2_id;

            if ((currentTurn == 1 && player1ID == playerID) || (currentTurn == 2 && player2ID == playerID) )
                GetUnitDamage();
            else
                res.json({ message: "Not your turn!" });
        });
    }

    function IncreaseHP(unit_id, amount) {
        connection.query(
            "UPDATE player_unit SET curr_unit_hp = curr_unit_hp + ? WHERE player_unit_id = ?",
            [amount, unit_id],
            (err) => {
                if (err) {
                    console.log(" Error increasing HP:", err);
                } else {
                    console.log(` Unit ${unit_id} gained ${amount} HP`);
                }
            }
        );
    }

    function SelfDestruct(unit_id, amount){
        connection.query("UPDATE player_unit SET curr_unit_atk = GREATEST(curr_unit_atk - ?, 0) WHERE player_unit_id = ?",
             [amount, unit_id],
            (err) => {
                if (err) {
                    console.log(" Error applying self destruct:", err);
                } else {
                    console.log(` Unit ${unit_id} lost ${amount}`);
                }
            }
        );
    }

    function ApplyRecklessBuff(unit_id, amount) {
        connection.query(
            "UPDATE player_unit SET curr_unit_hp = GREATEST(curr_unit_hp - ?, 0), curr_unit_atk = curr_unit_atk + ? WHERE player_unit_id = ?",
            [amount, amount, unit_id],
            (err) => {
                if (err) {
                    console.log(" Error applying reckless buff:", err);
                } else {
                    console.log(` Unit ${unit_id} lost ${amount} HP and gained ${amount} ATK`);
                }
            }
        );
    }

     function SurvivalInstict(unit_id, amount) {
      connection.query("UPDATE player_unit SET curr_unit_atk = curr_unit_atk + ? WHERE player_unit_id = ?", 
        [amount, unit_id], 
        (err) => {
           if (err) {
              console.log("Error applying Surival instict", err);
            } else {
                console.log(`Unit ${unit_id} gain ${amount} ATK`);
            }
           }
         );

         }
    
    function ExtraDamage(target_id, amount) {
    connection.query("UPDATE player_unit SET curr_unit_hp = curr_unit_hp - ? WHERE player_unit_id = ?",
       [amount, target_id],
            (err) => {
                if (err) {
                    console.log(" Error doing extra damage:", err);
                } else {
                    console.log(` Enemy ${target_id} lost extra ${amount} HP`);
                }
            }
        );

    }


    function DebuffATK(target_id, amount) {
     connection.query(
        "UPDATE player_unit SET curr_unit_atk = GREATEST(curr_unit_atk - ?, 0) WHERE player_unit_id = ?",
        [amount, target_id],
        (err) => {
            if (err) {
                console.log(" Error applying debuff to target:", err);
            } else {
                console.log(`Debuff:Target unit ${target_id} lost ${amount} ATK`);
            }
        }
    );
}


    function BuffAllAlliesHP(player_id, amount) {
        connection.query(
            "UPDATE player_unit SET curr_unit_hp = curr_unit_hp + ? WHERE player_id = ? AND curr_unit_hp > 0",
            [amount, player_id],
            (err) => {
                if (err) {
                    console.log("Error buffing allies' HP:", err);
                } else {
                    console.log(`All allies of player ${player_id} gained ${amount} HP permanently`);
                }
            }

           
        );
    }


    
 function DamageAllEnemies(attacker_player_id, amount) {
    console.log(`DamageAllEnemies called with attacker_player_id: ${attacker_player_id}, amount: ${amount}`);
    
    connection.query(
        `SELECT game_ply1_id, game_ply2_id FROM game_state WHERE game_ply1_id = ? OR game_ply2_id = ? LIMIT 1`,
        [attacker_player_id, attacker_player_id],
        (err, result) => {
            if (err || result.length === 0) {
                console.log(" Could not find enemies:", err);
                return;
            }

            const game = result[0];
            const enemy_player_id = game.game_ply1_id === attacker_player_id ? game.game_ply2_id : game.game_ply1_id;

            //  Damage all enemy units (only those with HP > 0)
            connection.query(`UPDATE player_unit SET curr_unit_hp = GREATEST(curr_unit_hp - ?, 0) WHERE player_id = ? AND curr_unit_hp > 0`,
                [amount, enemy_player_id],
                (err2) => {
                    if (err2) {
                        console.log(" Error damaging all enemies:", err2);
                    } else {
                        console.log(` All units of enemy player ${enemy_player_id} took ${amount} damage`);
                    }
                }
            );
        }
    );
}  

    function ExecuteAttack(attacker, target_id) {
    let finalDamage = attacker.curr_unit_atk;

    connection.query("SELECT curr_unit_hp FROM player_unit WHERE player_unit_id = ?",
        [target_id],
        (err, results) => {
            if (err || results.length === 0) {
                console.log("Error fetching target HP:", err);
                return;
            }

            const targetHP = results[0].curr_unit_hp;
           

            if (targetHP < 15) {
                finalDamage *= 2;
                console.log(`Execute was triggered! Target had ${targetHP} HP. Damage doubled to ${finalDamage}.`);
            } else {
                console.log(`Not execute`);
            }

             MakeDamage(target_id, finalDamage);

           }
        
          );  
        }
    

    function BuffAllAlliesATK(player_id, amount) {
        connection.query("UPDATE player_unit SET curr_unit_atk = curr_unit_atk + ? WHERE player_id = ?",
        [amount, player_id],
        (err) => {
            if (err) { 
                console.log("Error buffing allies ATK:", err);
            } else { 
                console.log(`All allies of player ${player_id} gained ${amount} ATK permanently`)
            }

            }

        );

    }

    


    function HealAllies(attacker) {

    connection.query(`SELECT unit_type_id FROM unit WHERE unit_id = ?`, [attacker.unit_id], (err, results) => {
        if (err || results.length === 0) {
            console.log("Error fetching unit_type_id:", err);
            return;
        }

        const unitTypeId = results[0].unit_type_id;

        if (unitTypeId !== 2) {
            console.log("Unit is not a healer.");
            return;
        }

        const healAmount = attacker.curr_unit_heal;

        connection.query(`SELECT pu.player_unit_id, pu.curr_unit_hp, pu.unit_id, u.unit_hp FROM player_unit pu JOIN unit u ON pu.unit_id = u.unit_id WHERE pu.player_id = ?`, [attacker.player_id], (err, allies) => {
            if (err) {
                console.log("Error fetching allies:", err);
                return;
            }

            allies.forEach(ally => {
                if (ally.player_unit_id !== attacker.player_unit_id && ally.curr_unit_hp > 0) {
                    const newHP = Math.min(ally.curr_unit_hp + healAmount, ally.unit_hp);

                    connection.query(
                        "UPDATE player_unit SET curr_unit_hp = ? WHERE player_unit_id = ?",
                        [newHP, ally.player_unit_id],
                        (err2) => {
                            if (err2) {
                                console.log("Error healing ally:", err2);
                            } else {
                                console.log(`Healed ally ${ally.player_unit_id} to ${newHP}/${ally.unit_hp}`);
                            }
                        }
                    );
                }
            });
        });
    }); 
}
    

    function GetUnitDamage() {
        const attackerIds = attackingUnits.map(u => u.unit_id);
    
        connection.query("SELECT * FROM player_unit WHERE player_unit_id IN (?)", [attackerIds],
            function(err, rows) {
                if (err) {
                    console.log(err);
                    res.json({ "error": err });
                    return;
                }
    
                if (rows.length === 0) {
                    res.json({ "error": "No units found" });
                    return;           
                }

    
                attackingUnits.forEach(attack => {  
                    var target_id = attack.target_id;
                    console.log("Attacker ID:", attack.unit_id);
    
                    const attacker = rows.find(unit => unit.player_unit_id == attack.unit_id);
                    let damage;
    
                    if (attacker) {
                        console.log("Found attacker:", attacker.player_unit_id, "ATK:", attacker.curr_unit_atk);
                        damage = attacker.curr_unit_atk;
                        console.log(damage)

                    
                    } else {
                        console.log("Attacker not found in DB rows.");
                        damage = 1;
                    }

            
                    if (attacker.unit_id == 1) {
                        console.log(` Ability triggered: Unit ${attacker.player_unit_id} gains 5 HP`);
                        IncreaseHP(attacker.player_unit_id, 5);
                    }

                    if (attacker.unit_id == 4) {
                        BuffAllAlliesATK(attacker.player_id, 1)

                    }

                    else if (attacker.unit_id == 11) {
                        console.log(` Ability triggered: Unit ${attacker.player_unit_id} loses 2 HP and gains +2 ATK`);
                        ApplyRecklessBuff(attackattacker.player_unit_id, 2);
                   }
    
                    else if (attacker.unit_id == 3 ) {
                        BuffAllAlliesHP(attacker.player_id, 2);
                    }

                    else if (attacker.unit_id == 10) {
                        ExecuteAttack(attacker, target_id)
                    }

                    else if (attacker.unit_id == 2  && attacker.curr_unit_hp<30) {
                         SurvivalInstict(attacker.player_unit_id, 5)

                     }

                     else if (attacker.unit_id == 9){
                        DamageAllEnemies(attacker.player_id, 2)

                     }

                    else if (attacker.unit_id == 8) {
                        SelfDestruct(attacker.player_unit_id, 1);
                    }

                    else if (attacker.unit_id == 6) {
                        DebuffATK(target_id, 3)
                    }


                    else if (attacker.unit_id == 7) {
                        const extra = Math.floor(Math.random() * 11);
                        ExtraDamage(target_id, extra); 
                    }

                    


                    console.log("Applying", damage, "damage to unit", target_id);
                    MakeDamage(attacker.player_unit_id, target_id,target_id, damage);
                    
                    HealAllies(attacker);
                    

                    
                });
    
            EndTurn();
        });
    }

   function MakeDamage(attacker_unit_id, defender_unit_id, target_id, damage) {
    // Get attacker's unit_type_id
    connection.query(
        `SELECT u.unit_type_id FROM player_unit pu JOIN unit u ON pu.unit_id = u.unit_id WHERE pu.player_unit_id = ?`,[attacker_unit_id],
        (err, attackerResults) => {
            if (err || attackerResults.length === 0) {
                console.log("Error fetching attacker's unit_type_id:", err);
                return;
            }

            const unit_type_id = attackerResults[0].unit_type_id;

            // Apply crit chance 
            if (unit_type_id === 3) {
                const roll = Math.random(); 
                 console.log(`Crit roll: ${roll}`);
                if (roll < 0.1) {
                    damage *= 1.5;
                    console.log(" Crit Hit! Damage doubled.");
                } else {
                 console.log("Not crit!")
                }
            }

       
            connection.query(
                `SELECT pu.player_id FROM player_unit pu WHERE pu.player_unit_id = ?`,
                [defender_unit_id],
                (err2, results) => {
                    if (err2 || results.length === 0) {
                        console.log("Error fetching defender's player_id:", err2);
                        return;
                    }

                    const playerId = results[0].player_id;

                    //  Check for tank unit
                    connection.query(
                        `SELECT pu.player_unit_id FROM player_unit pu JOIN unit u ON pu.unit_id = u.unit_id WHERE pu.player_id = ? AND u.unit_type_id = 1 AND pu.curr_unit_hp > 0 LIMIT 1`, [playerId],
                        (err3, results2) => {
                            if (err3) {
                                console.log("Error checking for defender units:", err3);
                                return;
                            }

                            if (results2.length > 0) {
                                damage = Math.max(0, damage - 5);
                                console.log(` Tank present — damage reduced to ${damage}`);
                            }

                            //  Apply final damage
                            connection.query(
                                "UPDATE player_unit SET curr_unit_hp = GREATEST(curr_unit_hp - ?, 0) WHERE player_unit_id = ?",
                                [damage, defender_unit_id],
                                (err4) => {
                                    if (err4) {
                                        console.log("Error applying damage:", err4);
                                    } else {
                                        console.log(` Applied ${damage} damage to unit ${defender_unit_id}`);
                                    }
                                }
                            );
                        }
                    );
                }
            );
        }
    );
}

    function EndTurn(){
        console.log("-------------------------------- Ending turn for player " + req.session.playerID + " ---------------------------------");
        connection.query("UPDATE game_state SET game_turn = CASE WHEN game_turn = 1 THEN 2 ELSE 1 END WHERE game_id = ?", [req.session.matchID], (err) => {
            if (err) {
                return res.status(500).json({ message: err });
            }

            // Check if opponent has no units left
            const opponentID = player1ID === req.session.playerID ? player2ID : player1ID;
            console.log("--> Opponent ID: " + opponentID);

            connection.query("SELECT COUNT(*) AS DeadUnits FROM player_unit WHERE player_id = ? AND curr_unit_hp <= 0", [opponentID],
                function (err, rows, fields) {
                    if (err) return res.status(500).json({ message: err });

                    console.log('--> Dead units for opponent: ' + rows[0].DeadUnits);
                    console.log('Query executed: SELECT COUNT(*) AS DeadUnits FROM player_unit WHERE player_id = ' + opponentID + ' AND curr_unit_hp <= 0');
                    if (rows[0].DeadUnits === 4) {
                        // All units of the player are dead
                        console.log("--> Player " + opponentID + " has no units left.");
                        connection.query("UPDATE game_state SET game_state = 1, game_winner = ?, game_loser = ?", [req.session.playerID, opponentID],
                            function (err, rows, fields) {
                                if (err) return res.status(500).json({ message: err });
                                res.json({
                                    message: "Game Over",
                                    winner: req.session.playerID,
                                    loser: opponentID
                                });  
                            })
                    }else{
                        console.log("--> Turn ended successfully for player " + req.session.playerID);
                        res.json({
                            message: "Turn ended successfully."
                        })
                    }
                }
            )
                                
        });
    }
    
    CheckIfIsPlayerTurn()
});

app.get("/gameOver", (req, res) => {
    const playerID = req.session.playerID;
    var player1ID
    var player2ID

    function GetPlayerIDS() {
        connection.query("SELECT game_turn, game_ply1_id, game_ply2_id FROM game_state WHERE game_id = ?", [req.session.matchID], (err, rows) => {
            if (err) {
                res.status(500).json({ message: err });
                return;
            }
    
            if (rows.length === 0) {
                res.status(404).json({ message: "Game not found" });
                return;
            }
    
            const currentTurn = rows[0].game_turn;
            player1ID = rows[0].game_ply1_id;
            player2ID = rows[0].game_ply2_id;

            CheckGameOver()
        });
    }

    function CheckGameOver(){
            const opponentID = player1ID === req.session.playerID ? player2ID : player1ID;

            connection.query("SELECT COUNT(*) AS DeadUnits FROM player_unit WHERE player_id = ? AND curr_unit_hp <= 0", [opponentID],
                function (err, rows, fields) {
                    if (err) return res.status(500).json({ message: err });

                    console.log('--> Dead units for opponent: ' + rows[0].DeadUnits);
                    console.log('Query executed: SELECT COUNT(*) AS DeadUnits FROM player_unit WHERE player_id = ' + opponentID + ' AND curr_unit_hp <= 0');
                    if (rows[0].DeadUnits === 4) {
                        // All units of the player are dead
                        console.log("--> Player " + opponentID + " has no units left.");
                        connection.query("UPDATE game_state SET game_state = 1, game_winner = ?, game_loser = ?", [req.session.playerID, opponentID],
                            function (err, rows, fields) {
                                if (err) return res.status(500).json({ message: err });
                                res.json({
                                    message: "Game Over",
                                    winner: req.session.playerID,
                                    loser: opponentID
                                });  
                            })
                    }else{
                        res.json({
                            message: "Game Not Finished"
                        })
                    }
                }
            )
    }

    GetPlayerIDS()
})

function applyBlessingEffects(playerId) {
    console.log("Grabbing blessing for playerId --> " + playerId)

    connection.query("SELECT * FROM player_blessing WHERE player_id = ?", [playerId],
        function (err, rows, fields) {
            if (err) {
                console.log("Error fetching blessing for playerId:", err);
                return;
            }

            if (rows.length === 0){
                console.log("No blessing found for playerId:", playerId);
                return;
            }

            useBlessing(playerId, rows[0].blessing_id);
        }
    )

 function useBlessing(playerId, blessingId){
        console.log("Applying blessing with ID " + blessingId + " for playerId " + playerId);
        connection.query("SET SQL_SAFE_UPDATES = 0")

        if (blessingId == 1) {
                // connection.query("UPDATE player_unit SET curr_unit_hp = curr_unit_hp + 10 WHERE player_id = ?", [playerId],
                connection.query("UPDATE player_unit SET curr_unit_hp = curr_unit_hp + (SELECT blessing_hp FROM blessing WHERE blessing_id = 1) WHERE player_id = ?", [playerId],
                    function (err, rows, fields) {
                        if (err) {
                            console.log("Error applying Wrath of War:", err);
                            return;
                        }

                        console.log(`All units of player ${playerId} gained 5 HP from Wrath of War. Rows affected: ${rows.affectedRows}`);
                    }
                        
                );
            } else if (blessingId == 2) {
                connection.query("UPDATE player_unit SET curr_unit_heal = curr_unit_heal + (SELECT blessing_heal FROM blessing WHERE blessing_id = 2) WHERE player_id = ?",[playerId],
                    (err) => {
                        if (err) {
                            console.log("Error applying Waters of Life:", err);
                        } else {
                            console.log(`All units of player ${playerId} gained 2 healing from Waters of Life.`);
                        }
                    }
                );
            } else if (blessingId == 3) {
                connection.query("UPDATE player_unit SET curr_unit_atk = curr_unit_atk + (SELECT blessing_atk FROM blessing WHERE blessing_id = 3) WHERE player_id = ?",[playerId],
                    (err) => {
                        if (err) {
                            console.log("Error applying Dance of the Blades:", err);
                        } else {
                            console.log(`All units of player ${playerId} gained 2 ATK from Dance of the Blades.`);
                        }
                    }
                );
            } else if (blessingId == 4) {
                connection.query("UPDATE player_unit SET curr_unit_hp = curr_unit_hp + (SELECT blessing_hp FROM blessing WHERE blessing_id = 4), curr_unit_atk = curr_unit_atk + (SELECT blessing_atk FROM blessing WHERE blessing_id = 4), curr_unit_heal = curr_unit_heal + (SELECT blessing_heal FROM blessing WHERE blessing_id = 4) WHERE player_id = ?",[playerId],
                    (err) => {
                        if (err) {
                            console.log("Error applying Sides of the Moon:", err);
                        } else {
                            console.log(`All units of player ${playerId} gained 1 HP, 1 ATK, and 1 healing from Sides of the Moon.`);
                        }
                    }
                );
            } else {
                console.log("Invalid blessing ID");
            }
            connection.query("SET SQL_SAFE_UPDATES = 1")
    }
}

// Run the server
app.listen(serverPort, () => {
    console.log("Server is running at http://localhost:" + serverPort + "/")
});