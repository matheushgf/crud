<?php 
	$host = "localhost";
	$user = "root";
	$pass = "";
	$database = "seriesmatch";

	if($_SERVER['REQUEST_METHOD'] === "POST"){
		$_POST = json_decode(file_get_contents('php://input'), true);
		if(isset($_POST["request"]) && $_POST["request"] === "getshows"){
			$conn = new mysqli($host, $user, $pass, $database) or die("{'error': 'Connection to the database failed'}");
			$sql="SELECT * FROM shows";
			$rs=$conn->query($sql);
			 
			if($rs === false) {
				$response = array("error" => true,
					"error_details" => $conn->error);
				
				echo json_encode($response);
			}else{
				$values=array();
				while ($show = $rs->fetch_assoc()) {
					array_push($values, array("id" => $show['id'],
						"name" => $show['name'],
						"year" => $show['year'],
						"gender" => $show['gender']
						));
				}
				$response = array("error" => false,
						"values" => $values);
				echo json_encode($response);
			}
			
			$conn->close();
		}else if(isset($_POST["request"]) && $_POST["request"] === "newshow"){
			if(isset($_POST["id"]) && isset($_POST["name"]) && isset($_POST["year"]) && isset($_POST["gender"])){
				$conn = new mysqli($host, $user, $pass, $database) or die("{'error': 'Connection to the database failed'}");
				$binding = $conn->prepare("INSERT INTO shows VALUES(?, ?, ?, ?)");
				$binding->bind_param('isis', $_POST["id"], $_POST["name"], $_POST["year"], $_POST["gender"]);
				$binding->execute();

				if($binding->affected_rows === 1){
					$response = array("error" => false);
					echo json_encode($response);
				}
				else{
					$response = array("error" => true,
						"error_details" => $binding->error
						);
					echo json_encode($response);
				}
				$binding->close();
			}else{
				$response = array("error" => true,
						"error_details" => "Missing parameters"
						);
				echo json_encode($response);
			}
		}else if(isset($_POST["request"]) && $_POST["request"] === "deleteshow"){
			if(isset($_POST["id"])){
				$conn = new mysqli($host, $user, $pass, $database) or die("{'error': 'Connection to the database failed'}");
				$binding = $conn->prepare("DELETE FROM shows WHERE id=?");
				$binding->bind_param('i', $_POST["id"]);
				$binding->execute();

				if($binding->affected_rows === 1){
					$response = array("error" => false,
						"sucess_message" => "Deleted with sucess"
						);
					echo json_encode($response);
				}
				else{
					$response = array("error" => true,
						"error_details" => $binding->error." Errooo"
						);
					echo json_encode($response);
				}
				$binding->close();
			}else{
				$response = array("error" => true,
						"error_details" => "Missing parameters"
						);
					echo json_encode($response);
			}
		}
		else if(isset($_POST["request"]) && $_POST["request"] === "updateshow"){
			if(isset($_POST["id"]) && isset($_POST["name"]) && isset($_POST["year"]) && isset($_POST["gender"])){
				$conn = new mysqli($host, $user, $pass, $database) or die("{'error': 'Connection to the database failed'}");
				$binding = $conn->prepare("UPDATE shows SET name=?, year=?, gender=? WHERE id=?");
				$binding->bind_param('sisi', $_POST["name"], $_POST["year"], $_POST["gender"], $_POST["id"]);
				$binding->execute();

				if($binding->affected_rows === 1){
					$response = array("error" => false);
					echo json_encode($response);
				}
				else{
					$response = array("error" => true,
						"error_details" => "Não existente"
						);
					echo json_encode($response);
				}
				$binding->close();
			}else{
				$response = array("error" => true,
						"error_details" => "Missing parameters"
						);
				echo json_encode($response);
			}
		}else{
			$response = array("error" => true,
					"error_details" => "No request made",
					"post" => $_POST
					);
			
			//echo json_encode($response);
		}
	}else{
		echo "Não é requisição POST";
	}

?>