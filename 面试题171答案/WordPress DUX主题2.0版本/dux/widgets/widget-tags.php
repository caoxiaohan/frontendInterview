<?php

class widget_ui_tags extends WP_Widget {
	/*function widget_ui_tags() {
		$widget_ops = array( 'classname' => 'widget_ui_tags', 'description' => '显示热门标签' );
		$this->WP_Widget( 'widget_ui_tags', 'D-标签云', $widget_ops );
	}*/

	function __construct(){
		parent::__construct( 'widget_ui_tags', 'DUX 标签云', array( 'classname' => 'widget_ui_tags' ) );
	}

	function widget( $args, $instance ) {
		extract( $args );

		$title  = apply_filters('widget_name', $instance['title']);
		$count  = isset($instance['count']) ? $instance['count'] : 30;
		$offset = isset($instance['offset']) ? $instance['offset'] : 0;

		echo $before_widget;
		echo $before_title.$title.$after_title; 
		echo '<div class="items">';
		$tags_list = get_tags('orderby=count&order=DESC&number='.$count.'&offset='.$offset);
		if ($tags_list) { 
			foreach($tags_list as $tag) {
				echo '<a href="'.get_tag_link($tag).'">'. $tag->name .' ('. $tag->count .')</a>'; 
			} 
		}else{
			echo '暂无标签！';
		}
		echo '</div>';
		echo $after_widget;
	}

	function form($instance) {
		$defaults = array( 
			'title' => '热门标签', 
			'count' => 30, 
			'offset' => 0
		);
		$instance = wp_parse_args( (array) $instance, $defaults );
?>
		<p>
			<label>
				名称：
				<input id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $instance['title']; ?>" class="widefat" />
			</label>
		</p>
		<p>
			<label>
				显示数量：
				<input id="<?php echo $this->get_field_id('count'); ?>" name="<?php echo $this->get_field_name('count'); ?>" type="number" value="<?php echo $instance['count']; ?>" class="widefat" />
			</label>
		</p>
		<p>
			<label>
				去除前几个：
				<input id="<?php echo $this->get_field_id('offset'); ?>" name="<?php echo $this->get_field_name('offset'); ?>" type="number" value="<?php echo $instance['offset']; ?>" class="widefat" />
			</label>
		</p>
		
<?php
	}
}