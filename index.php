<?php
    require_once 'load.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://unpkg.com/vue/dist/vue.js"></script>
    <title>Document</title>
</head>
<body>
    <h1>Haversine Test Page</h1>
    <!-- <form action="index.php" method="post">
        <label>Your Postal Code</label>
        <input name="postal" type="text" value="">
        <button name="submit">Submit</button>
    </form> -->
    <main id="app">
        <form @submit.prevent="pullLocation(postal)">
            <label>Your Postal Code</label>
            <input v-model="postal" maxlength="6" name="postal">
            <button name="submit">Submit</button>
        </form>
    </main>
    <script src="js/main.js"></script>
</body>
</html>