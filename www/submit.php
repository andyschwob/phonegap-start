<?php
header('Access-Control-Allow-Origin: *');  
$mysql_host = "mysql6.000webhost.com";
$mysql_database = "a2507194_anxiety";
$mysql_user = "a2507194_andy";
$mysql_password = "blues190";


  $con=mysqli_connect($mysql_host,$mysql_user,$mysql_password,$mysql_database);
  
  // Check connection
  if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
  } else {

  }

$name = $_GET['name'];
$userid = $_GET['userid'];
$sessions = $_GET['sessions'];

if ($_GET['name'] && $_GET['userid'] && $_GET['sessions']) {
  for ($i = 0; $i < count($sessions); ++$i) {
      $session = $sessions[$i];
/*
      if (is_array($session["what_feelings"])) {
        
      }
*/
      $anxietyLevel = $session["anxietyLevel"];
      $feel = $session["feel"];
      $what_thoughts = $session["what_thoughts"];
      $what_feelings = $session["what_feelings"];
      $things_to_do = $session["things_to_do"];
      $things = '';
      $timestamp = $session["timestamp"];
      $formatted_date = $session["formatted_date"];
      
      for ($j = 0; $j < count($things_to_do); ++$j) {
        if ( ($j+1) < count($things_to_do) ) {
          $comma = ", ";
        } else {
          $comma = "";
        }
        $things = $things . $things_to_do[$j] . $comma;
      }
      
      echo $formatted_date . "<br>";
      
      $runcheck = mysqli_query($con,"INSERT INTO sessions (userid, name, level, feel, what_thoughts, what_feelings, things_to_do, timestamp, formatted_date)  VALUES ('$userid', '$name', '$anxietyLevel', '$feel', '$what_thoughts', '$what_feelings', '$things', '$timestamp', '$formatted_date')");
/*

      if (mysqli_error($runcheck)) {
        echo "error";
      } else {
        echo "success";
      }
      
*/
     // echo $things_to_do;
  }

  
} else {
  echo "no sessions to upload";
}
/*
if (mysqli_error($runcheck)) {
  echo "error";
} else {
  echo "success";
}
*/
mysqli_close($con);
exit;

// $json ='{"name":"jack","school":"colorado state","city":"NJ","id":"234234"}';// You can get it from database,or Request parameter like $_GET,$_POST or $_REQUEST or something :p
/*


echo $get . "<br><br>";
*/

//$json = '{"name":"Tuna","sessions":[{"anxietyLevel":2,"feel":"The cardinals offense","what_thoughts":"Holliday sucks","what_feelings":"I have to poop","things_to_do":["watch tv/movie","try to take a nap","stop watching baseball"],"timestamp":1403413944318,"formatted_date":"6-21-14"},{"anxietyLevel":6,"feel":"Flying in a plane","what_thoughts":"we might crash","what_feelings":"feeling scared","things_to_do":["watch tv/movie","try to take a nap","don\'t crash"],"timestamp":1403414305637,"formatted_date":"6-21-14"},{"anxietyLevel":4,"feel":"world cup","what_thoughts":"hope the US wins","what_feelings":"feeling nervous","things_to_do":["call a friend or family member","go for a walk","focus on breathing"],"timestamp":1403457960736,"formatted_date":"6-22-14"}],"tempSession":{},"thingsToDo":[]}';
/*
echo "<br><br>"
echo $json;
echo "<br><br>"
*/
//var_dump(json_decode($json));
//$json_array = json_decode($json, true);

/*
    for ($i = 0; $i < count($json_array["sessions"]); ++$i) {
        $session = $json_array["sessions"][$i];
        if (is_array($session["what_feelings"])) {
          
        }
        echo $session["formatted_date"];
        echo "<br><br><br>";
    }
*/
/*
 echo $json_array["name"];
 echo $json_array["school"];
 echo $json_array["city"];
 echo $json_array["id"];
*/
//var $sessions = $json_array["sessions"];
// echo $json_array["sessions"];
/*
var_dump($sessions);
foreach ($sessions as $session) {
    echo $session;
}
*/

//var_dump(json_decode($json, true));

/*
 echo $json;
 
 $json_array = json_decode($json);



echo $json_array;
*/
/*
 echo $json_array["name"];
 echo $json_array["school"];
 echo $json_array["city"];
 echo $json_array["id"];
*/
?>
<!--