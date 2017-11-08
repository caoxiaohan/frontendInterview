<?php

class widget_ui_readers extends WP_Widget {
	/*function widget_ui_readers() {
		$widget_ops = array( 'classname' => 'widget_ui_readers', 'description' => '显示近期评论频繁的网友头像等' );
		$this->WP_Widget( 'widget_ui_readers', 'D-活跃读者', $widget_ops );
	}*/

	function __construct(){
		parent::__construct( 'widget_ui_readers', 'DUX 活跃读者', array( 'classname' => 'widget_ui_readers' ) );
	}

	function widget( $args, $instance ) {
		extract( $args );

		$title   = apply_filters('widget_name', $instance['title']);
		$outer   = isset($instance['outer']) ? $instance['outer'] : 1;
		$timer   = isset($instance['timer']) ? $instance['timer'] : 500;
		$limit   = isset($instance['limit']) ? $instance['limit'] : 32;
		$addlink = isset($instance['addlink']) ? $instance['addlink'] : '';

		echo $before_widget;
		echo $before_title.$title.$after_title; 
		echo '<ul>';
		echo dtheme_readers( $outer, $timer, $limit, $addlink );
		echo '</ul>';
		echo $after_widget;
	}
	function form($instance) {
		$defaults = array( 
			'title' => '活跃读者', 
			'limit' => 32, 
			'outer' => 1,
			'timer' => 500
		);
		$instance = wp_parse_args( (array) $instance, $defaults );

?>
		<p>
			<label>
				标题：
				<input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $instance['title']; ?>" />
			</label>
		</p>
		<p>
			<label>
				显示数目：
				<input class="widefat" id="<?php echo $this->get_field_id('limit'); ?>" name="<?php echo $this->get_field_name('limit'); ?>" type="number" value="<?php echo $instance['limit']; ?>" />
			</label>
		</p>
		<p>
			<label>
				排除某人：
				<input class="widefat" id="<?php echo $this->get_field_id('outer'); ?>" name="<?php echo $this->get_field_name('outer'); ?>" type="text" value="<?php echo $instance['outer']; ?>" />
			</label>
		</p>
		<p>
			<label>
				几天内：
				<input class="widefat" id="<?php echo $this->get_field_id('timer'); ?>" name="<?php echo $this->get_field_name('timer'); ?>" type="number" value="<?php echo $instance['timer']; ?>" />
			</label>
		</p>
		<p>
			<label>
				<input style="vertical-align:-3px;margin-right:4px;" class="checkbox" type="checkbox" <?php checked( $instance['addlink'], 'on' ); ?> id="<?php echo $this->get_field_id('addlink'); ?>" name="<?php echo $this->get_field_name('addlink'); ?>">加链接
			</label>
		</p>
		

<?php
	}
}

/* 
 * 读者墙
 * dtheme_readers( $outer='name', $timer='3', $limit='14' );
 * $outer 不显示某人
 * $timer 几个月时间内
 * $limit 显示条数
*/
function dtheme_readers($outer,$timer,$limit,$addlink){
	global $wpdb;
	$comments = $wpdb->get_results("SELECT count(comment_author) AS cnt, user_id, comment_author, comment_author_url, comment_author_email FROM $wpdb->comments WHERE comment_date > date_sub( now(), interval $timer day ) AND user_id!='1' AND comment_author!=$outer AND comment_approved='1' AND comment_type='' GROUP BY comment_author ORDER BY cnt DESC LIMIT $limit");

	$html = '';
	foreach ($comments as $comment) {
		$c_url = $comment->comment_author_url;
		if ($c_url == '') $c_url = 'javascript:;';

		if($addlink == 'on'){
			$c_urllink = ' href="'. $c_url . '"';
		}else{
			$c_urllink = '';
		}
		$html .= '<li><a title="['.$comment->comment_author.'] 近期点评'. $comment->cnt .'次" target="_blank"'.$c_urllink.'>'._get_the_avatar($user_id=$comment->user_id, $user_email=$comment->comment_author_email).'</a></li>';
	}
	echo $html;
}