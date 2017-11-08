<?php 

// ini_set('display_errors','On');
require dirname(__FILE__).'/../../../../wp-load.php';

$cuid = get_current_user_id();


/*$disable_reg_keywords = _hui('user_nickname_out');
if( $disable_reg_keywords ){
	$disable_reg_keywords = explode("\n", $disable_reg_keywords);
}*/

function is_disable_username($name){
	global $disable_reg_keywords;

	if( !$disable_reg_keywords || !$name ){
		return false;
	}

	foreach ($disable_reg_keywords as $value) {
		if( !empty($value) && is_in_str(strtolower($name), strtolower($value)) ){
			return true;
		}
	}

	return false;
}

function is_in_str($haystack, $needle) { 
    $haystack = '-_-!' . $haystack; 
    return (bool)strpos($haystack, $needle); 
} 

function get_millisecond() {
    list($s1, $s2) = explode(' ', microtime());     
    return (float)sprintf('%.0f', (floatval($s1) + floatval($s2)) * 1000);  
}

function sstrlen($str,$charset='utf-8') {        
    $n = 0; $p = 0; $c = '';
    $len = strlen($str);
    if($charset == 'utf-8') {
        for($i = 0; $i < $len; $i++) {
            $c = ord($str{$i});
            if($c > 252) {
                $p = 5;
            } elseif($c > 248) {
                $p = 4;
            } elseif($c > 240) {
                $p = 3;
            } elseif($c > 224) {
                $p = 2;
            } elseif($c > 192) {
                $p = 1;
            } else {
                $p = 0;
            }
            $i+=$p;$n++;
        }
    } else {
        for($i = 0; $i < $len; $i++) {
            $c = ord($str{$i});
            if($c > 127) {
                $p = 1;
            } else {
                $p = 0;
        }
            $i+=$p;$n++;
        }
    }        
    return $n;
}