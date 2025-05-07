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

                CreateTeam(rows.insertId)
            }
        )
    }

    function CreateTeam(playerID){
        connection.query("INSERT INTO player_unit (player_id) VALUES (?)", [playerID],
            function (err, rows, fields) {
                if (err){
                    res.send("Error: " + err);
                    // res.redirect("../index.html")
                    return;
                }

                res.send("Registered Successfully! <br/> <a href='login.html'>Go to login page</a>")
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
                    "username": req.session.username
                }
            );
        }else{
            if (rows[0].game_ply2_id == null){
                // Means that there is no opponent yet.
                res.status(404).json(
                    {
                        "message": "You are waiting for a game",
                        "state": "WAITING_MATCH",
                        "username": req.session.username
                    }
                );
            }else{
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

// Endpoint /logout - Logs the user out by destroying the session.
app.get("/logout", (req, res) => {
    // Destroy the session. Other way of doing it is to set the session to null.
    req.session.destroy();
    res.send("Logged out successfully! <br/><a href='/login.html'>Login</a>");
})

app.post("/searchMatch", (req, res) => {
    connection.query("SELECT game_id FROM Fates_exactbeeam.game_state WHERE game_ply1_id IS NOT NULL AND game_ply2_id IS NULL", function (err, rows, fields) {
        if (err) {
            console.log(err)
            res.status(500).send(err);
            return;
        }

        if (rows.length > 0){
            req.session.matchID = rows[0].game_id;
            connection.query("UPDATE Fates_exactbeeam.game_state SET game_ply2_id = ? WHERE game_id = ?",
                [req.session.playerID, req.session.matchID],
                function (err, rows, fields) {
                    if (err){
                        res.send(err)
                        return
                    }
            
                    res.json({
                        "message": "Match found!",
                    })
                }
            )

        } else {
            connection.query("INSERT INTO Fates_exactbeeam.game_state (game_ply1_id) VALUES (?)",
                [req.session.playerID],
                function (err, rows, fields) {
                    if (err){
                        res.send(err)
                        return
                    }

                    res.json({
                        "message": "Match created!",
                    })
                }
            )
        }
    })
})

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
        connection.query("DELETE FROM Fates_exactbeeam.game_state WHERE (game_id = ?) AND (game_ply1_id = ?)",
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
    if(!req.session.username){
        res.status(401).json({message: "User not logged in"});
        return;
    }

    // connection.query("SELECT tank, support, damage1, damage2, blessing FROM player_team WHERE player_id = ?",
    connection.query("SELECT  WHERE player_id = ?",
        [req.session.playerID],
        function (err, rows, fields) {
            if(err){
                res.status(500).json({"message": err});
                return;
            }
            if(rows.length >= 1){
                res.status(200).json({
                    "message": "Team data found.",
                    // "tank": rows[0].tank,
                    // "support": rows[0].support,
                    // "damage1": rows[0].damage1,
                    // "damage2": rows[0].damage2,
                    // "blessing": rows[0].blessing,
                    // "username": req.session.username
                });
            }else{
                res.status(404).json({
                "message": "Team data not found.",
                "username": req.session.username
            });
            }
        }
    );
});

app.put("/confirmTeam", (req, res) => {
    // var tank = req.body.tank;
    // if (!tank) tank = undefined;

    // var damage1 = req.body.damage1;
    // if (!damage1) damage1 = undefined;

    // var damage2 = req.body.damage2;
    // if (!damage2) damage2 = undefined;

    // var support = req.body.support;
    // if (!support) support = undefined;

    // var blessing = req.body.blessing;
    // if (!blessing) blessing = undefined;

    // Check if a team already exists for the user.
    connection.query("SELECT * FROM player_unit WHERE player_id = ?", [req.session.playerID], function (err, rows, fields) {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        if (rows.length > 0) {
            // Team already exists, update the existing team.
            // connection.query("UPDATE player_team SET tank = ?, support = ?, damage1 = ?, damage2 = ?, blessing = ? WHERE player_id = ?", [tank, support, damage1, damage2, blessing, req.session.playerID],
            connection.query("UPDATE  WHERE player_id = ?", [, req.session.playerID],
                function (err, rows, fields) {
                    if (err) {
                        return res.status(500).json({ message: err.message });
                    }
                    res.status(200).json({ message: "Team updated successfully." });
                }
            );
        } else {
            // No team exists, create a new team.
            // connection.query("INSERT INTO player_team (player_id, tank, support, damage1, damage2, blessing) VALUES (?, ?, ?, ?, ?, ?)", [tank, support, damage1, damage2, blessing, req.session.playerID],
            connection.query("INSERT INTO ", [, req.session.playerID],
                function (err, rows, fields) {
                    if (err) {
                        return res.status(500).json({ message: err.message });
                    }
                    res.status(200).json({ message: "Team created successfully." });
                }
            );
        }
    });
});

app.get("/getMatchState", (req, res) => {
    if (!req.session.username) {
        res.status(401).json({ message: "User  not logged in" });
        return;
    }

    function GetMatchState(){
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
    
            connection.query("SELECT * FROM player_unit WHERE player_id = ? OR player_id = ?", [gameState.game_ply1_id, gameState.game_ply2_id], (err, unitRows) => {
                if (err) {
                    res.status(500).json({ message: err });
                    return;
                }
    
                const playerUnits = {
                    player1: [],
                    player2: []
                };

                //mudar de lado no player2
    
                unitRows.forEach(unit => {
                    playerUnits[unit.player_id === gameState.game_ply1_id ? 'player1' : 'player2'].push({
                        unit_id: unit.unit_id,
                        curr_unit_hp: unit.curr_unit_hp,
                        curr_unit_atk: unit.curr_unit_atk,
                        curr_unit_heal: unit.curr_unit_heal,
                        slot_id: unit.slot_id,
                        player_unit_id: unit.player_unit_id
                    });
                });
    
                // Determine whose turn it is
                const currentTurn = gameState.game_turn === 1 ? "Player 1" : "Player 2";
    
                res.status(200).json({
                    message: "Match state retrieved successfully.",
                    game_state: {
                        current_turn: currentTurn,
                        player_units: playerUnits,
                        game_status: gameState.game_state // 0 for ongoing, 1 for finished, etc.
                    }
                });
            });
        });
    }

    function GetMatchID(){
        connection.query("SELECT game_id FROM game_state WHERE game_ply1_id = ? OR game_ply2_id = ?", [req.session.playerID,req.session.playerID],
            function (err, rows, fields){
                if (err) {
                    res.status(500).json({ "message": err });
                    return;
                }

                if (rows.length == 0){
                    res.status(404).json({"message": "Not in a match"})
                    return
                }

                req.session.matchID = rows[0].game_id
                GetMatchState()
            }
        )
    }

    if (!req.session.matchID)
        GetMatchID()
    else
        GetMatchState()
});
 
app.put("/attack", (req, res) => {
    if (!req.session.username) {
        res.status(401).json({ message: "User  not logged in" });
        return;
    }

    const attackingUnits = req.body.attackingUnits;
    const playerID = req.session.playerID;

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
            const player1ID = rows[0].game_ply1_id;
            const player2ID = rows[0].game_ply2_id;

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

    function BuffAllAlliesHP(player_id, amount) {
        connection.query(
            "UPDATE player_unit SET curr_unit_hp = curr_unit_hp + ? WHERE player_id = ?",
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

    function HealAllies(attacker) {
        const healAmount = attacker.curr_unit_heal;
    
        connection.query(`
            SELECT pu.player_unit_id, pu.curr_unit_hp, pu.unit_id, u.unit_hp
            FROM player_unit pu
            JOIN unit u ON pu.unit_id = u.unit_id
            WHERE pu.player_id = ?
        `, [attacker.player_id], (err, allies) => {
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

                    
                    } else {
                        console.log("Attacker not found in DB rows.");
                        damage = 1;
                    }

                    if (attacker.unit_id == 1) {
                        console.log(`🔁 Ability triggered: Unit ${attacker.player_unit_id} gains 5 HP`);
                        IncreaseHP(attacker.player_unit_id, 5);
                    }

                    else if (attacker.unit_id == 11) {
                        console.log(`🔥 Ability triggered: Unit ${attacker.player_unit_id} loses 2 HP and gains +2 ATK`);
                        ApplyRecklessBuff(attacker.player_unit_id, 2);
                   }
    
                    else if (attacker?.unit_id == 2) {
                        BuffAllAlliesHP(attacker.player_id, 2);
                    }

                    else if (attacker.unit_id == 9) {
                        SelfDestruct(attacker.player_unit_id, 1);
                    }

                    

                    console.log("Applying", damage, "damage to unit", target_id);
                    MakeDamage(target_id, damage);

                    if (attacker.unit_id === 4 || attacker.unit_id === 5) {
                        HealAllies(attacker);
                    }

                    
                });
    
            EndTurn();
        });
    }

    function MakeDamage(unit_id, damage){
        connection.query("UPDATE player_unit SET curr_unit_hp = GREATEST(curr_unit_hp - ?, 0) WHERE player_unit_id = ?", [damage, unit_id], (err) => {
            if (err) {
                console.log(err)
            }
        });

        console.log(`Damage query: UPDATE player_unit SET curr_unit_hp = GREATEST(curr_unit_hp - ${damage}, 0) WHERE player_unit_id = ${unit_id}`);
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

// Run the server
app.listen(serverPort, () => {
    console.log("Server is running at http://localhost:" + serverPort + "/")
});