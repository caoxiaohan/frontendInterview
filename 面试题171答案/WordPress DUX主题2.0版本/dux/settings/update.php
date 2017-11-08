<?php

function update_notifier_menu() {  
	$xml = get_latest_theme_version(14400); 
	$theme_data = wp_get_theme('dux'); 
	
	if(version_compare($theme_data['Version'], $xml->latest) == -1) {
		add_dashboard_page($theme_data['Name'].__('主题更新', 'haoui'), $theme_data['Name'].__('主题更新', 'haoui').'<span class="update-plugins count-1"><span class="update-count">'.$xml->latest.'</span></span>', 'administrator', strtolower($theme_data['Name']).'-update','update_notifier');
	}
}  

add_action('admin_menu', 'update_notifier_menu');

function update_notifier() { 
	$xml = get_latest_theme_version(14400); 
	$theme_data = wp_get_theme('dux');  ?>
	
	<style>
		.update-nag {display: none;}
		#instructions {max-width: 800px;}
		h3.title {margin: 30px 0 0 0; padding: 30px 0 0 0; border-top: 1px solid #ddd;}
	</style>

	<div class="wrap">
	
		<h2><?php echo $theme_data['Name']; ?><?php echo __('主题更新', 'haoui') ?></h2>
	    <div id="message" class="updated below-h2"><p><strong><?php echo $theme_data['Name']; ?><?php echo __('主题更新提示，', 'haoui') ?><?php echo __('当前版本：', 'haoui') ?><?php echo $theme_data['Version']; ?>，<?php echo __('可更新到最新版本：', 'haoui') ?><?php echo $xml->latest; ?>。</strong></p></div>
        
        <div id="instructions" style="max-width: 800px;">
            <h3>主题下载及更新：</h3>
            <p><strong>更新前：</strong>请先<strong>备份</strong>现有主题文件 <strong>/wp-content/themes/<?php echo strtolower($theme_data['Name']); ?>/</strong></p>
            <p>用你的账号登录到 <a target="_blank" href="https://themebetter.com">themebetter</a> 会员中心，在“我的订单”中找到该主题订单并下载主题zip压缩包。</p>
            <p>解压主题zip压缩包，使用FTP软件上传至服务器上的 <strong>/wp-content/themes/<?php echo strtolower($theme_data['Name']); ?>/</strong> 目录，替换所有文件。</p>
            <p>提示：更新主题过程中遇到问题请及时到 <a target="_blank" href="https://themebetter.com">themebetter</a> 提交工单已得到技术支持。</p>
            <br>
            <p><a class="button-primary" target="_blank" href="https://themebetter.com/member">获取主题<?php echo $xml->latest; ?>版本</a> <a class="button" target="_blank" href="https://themebetter.com/member/workorder-new">工单支持</a></p>
        </div>
        
        <div class="clear"></div>
	    
	    <h3 class="title">更新日志：</h3>

	    <?php echo $xml->changelog; ?>

	</div>
    
<?php } 


function get_latest_theme_version($interval) {

	$notifier_file_url = 'https://themebetter.com/tm/4j6Mrg/update';
	
	$db_cache_field = 'dux-notifier-cache';
	$db_cache_field_last_updated = 'dux-notifier-last-updated';
	$last = get_option( $db_cache_field_last_updated );
	$now = time();
	
	if ( !$last || (( $now - $last ) > $interval) ) {
		
		if( function_exists('curl_init') ) { 
			$ch = curl_init($notifier_file_url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_HEADER, 0);
			curl_setopt($ch, CURLOPT_TIMEOUT, 10);
			$cache = curl_exec($ch);
			curl_close($ch);
		} else {
			$cache = file_get_contents($notifier_file_url); 
		}
		
		if ($cache) {			
			
			update_option( $db_cache_field, $cache );
			update_option( $db_cache_field_last_updated, time() );			
		}
		
		$notifier_data = get_option( $db_cache_field );
	}
	else {
		
		$notifier_data = get_option( $db_cache_field );
	}
	
	if( strstr($notifier_data, '<?xml version="1.0" encoding="UTF-8"?>') ){
		$xml = simplexml_load_string($notifier_data); 
	}else{
		$theme_data = wp_get_theme('dux'); 
		$xml = (OBJECT) array('latest'=>$theme_data['Version']); 
	}
	
	return $xml;
}
