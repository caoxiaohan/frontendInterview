<?php

class widget_ui_statistics extends WP_Widget {
	/*function widget_ui_statistics() {
		$widget_ops = array( 'classname' => 'widget_ui_statistics', 'description' => '' );
		$this->WP_Widget( 'widget_ui_statistics', 'D-网站统计', $widget_ops );
	}*/

	function __construct(){
		parent::__construct( 'widget_ui_statistics', 'DUX 网站统计', array( 'classname' => 'widget_ui_statistics' ) );
	}

	function widget( $args, $instance ) {
		extract( $args );

		$title = apply_filters('widget_name', $instance['title']);
		$code  = isset($instance['code']) ? $instance['code'] : '';

		echo $before_widget;
		echo $before_title.$title.$after_title; 
		echo '<ul>';
		global $wpdb;
		
		if( isset($instance['post']) ){
			$count_posts = wp_count_posts();
			echo '<li><strong>日志总数：</strong>'.$count_posts->publish.'</li>';
		}

		if( isset($instance['comment']) ){
			$comments = $wpdb->get_var("SELECT COUNT(*) FROM $wpdb->comments");
			echo '<li><strong>评论总数：</strong>'.$comments.'</li>';
		}

		if( isset($instance['tag']) ){
			echo '<li><strong>标签总数：</strong>'.wp_count_terms('post_tag').'</li>';
		}

		if( isset($instance['page']) ){
			$count_pages = wp_count_posts('page');
			echo '<li><strong>页面总数：</strong>'.$count_pages->publish.'</li>';
		}

		if( isset($instance['cat']) ){
			echo '<li><strong>分类总数：</strong>'.wp_count_terms('category').'</li>';
		}

		if( isset($instance['link']) ){
			$links = $wpdb->get_var("SELECT COUNT(*) FROM $wpdb->links WHERE link_visible = 'Y'");
			echo '<li><strong>链接总数：</strong>'.$links.'</li>';
		}

		if( isset($instance['user']) ){
			$users = $wpdb->get_var("SELECT COUNT(ID) FROM $wpdb->users");
			echo '<li><strong>用户总数：</strong>'.$users.'</li>';
		}

		if( isset($instance['last']) ){
			$last = $wpdb->get_results("SELECT MAX(post_modified) AS MAX_m FROM $wpdb->posts WHERE (post_type = 'post' OR post_type = 'page') AND (post_status = 'publish' OR post_status = 'private')");
			$last = date('Y-m-d', strtotime($last[0]->MAX_m));
			echo '<li><strong>最后更新：</strong>'.$last.'</li>';
		}

		echo '</ul>';
		echo $after_widget;
	}

	function form($instance) {
		$defaults = array( 
			'title' => '网站统计',
			'post' => '',
			'comment' => '',
			'tag' => '',
			'page' => '',
			'cat' => '',
			'link' => '',
			'user' => '',
			'last' => ''
		);
		$instance = wp_parse_args( (array) $instance, $defaults );
?>
		<p>
			<label>
				标题：
				<input id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $instance['title']; ?>" class="widefat" />
			</label>
		</p>
		<p>
			<label>
				<input style="vertical-align:-3px;margin-right:4px;" class="checkbox" type="checkbox" <?php checked( $instance['post'], 'on' ); ?> id="<?php echo $this->get_field_id('post'); ?>" name="<?php echo $this->get_field_name('post'); ?>">显示日志总数
			</label>
		</p>
		<p>
			<label>
				<input style="vertical-align:-3px;margin-right:4px;" class="checkbox" type="checkbox" <?php checked( $instance['comment'], 'on' ); ?> id="<?php echo $this->get_field_id('comment'); ?>" name="<?php echo $this->get_field_name('comment'); ?>">显示评论总数
			</label>
		</p>
		<p>
			<label>
				<input style="vertical-align:-3px;margin-right:4px;" class="checkbox" type="checkbox" <?php checked( $instance['tag'], 'on' ); ?> id="<?php echo $this->get_field_id('tag'); ?>" name="<?php echo $this->get_field_name('tag'); ?>">显示标签总数
			</label>
		</p>
		<p>
			<label>
				<input style="vertical-align:-3px;margin-right:4px;" class="checkbox" type="checkbox" <?php checked( $instance['page'], 'on' ); ?> id="<?php echo $this->get_field_id('page'); ?>" name="<?php echo $this->get_field_name('page'); ?>">显示页面总数
			</label>
		</p>
		<p>
			<label>
				<input style="vertical-align:-3px;margin-right:4px;" class="checkbox" type="checkbox" <?php checked( $instance['cat'], 'on' ); ?> id="<?php echo $this->get_field_id('cat'); ?>" name="<?php echo $this->get_field_name('cat'); ?>">显示分类总数
			</label>
		</p>
		<p>
			<label>
				<input style="vertical-align:-3px;margin-right:4px;" class="checkbox" type="checkbox" <?php checked( $instance['link'], 'on' ); ?> id="<?php echo $this->get_field_id('link'); ?>" name="<?php echo $this->get_field_name('link'); ?>">显示链接总数
			</label>
		</p>
		<p>
			<label>
				<input style="vertical-align:-3px;margin-right:4px;" class="checkbox" type="checkbox" <?php checked( $instance['user'], 'on' ); ?> id="<?php echo $this->get_field_id('user'); ?>" name="<?php echo $this->get_field_name('user'); ?>">显示用户总数
			</label>
		</p>
		<p>
			<label>
				<input style="vertical-align:-3px;margin-right:4px;" class="checkbox" type="checkbox" <?php checked( $instance['last'], 'on' ); ?> id="<?php echo $this->get_field_id('last'); ?>" name="<?php echo $this->get_field_name('last'); ?>">显示最后更新
			</label>
		</p>
<?php
	}
}
