<?php
	$id = $_GET['id'];
	require("../connection.php");

	$connection = new Connection();
	$sql = "SELECT * from images WHERE id='$id'";
	$rs = $connection->Exec($sql);

	if($rs){
		$root = $_SERVER['DOCUMENT_ROOT']."/finder/";
		$path = $root.$rs->fetch_assoc()['path'];
		$fp = fopen($path, 'rb');
		$ext = pathinfo($path,PATHINFO_EXTENSION);
		header("Content-Type: image/$ext");
		header("Content-Length: " . filesize($path));
		fpassthru($fp);
	}

?>