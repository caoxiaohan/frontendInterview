<?php
add_action('widgets_init', 'unregister_d_widget');

function unregister_d_widget(){
    unregister_widget('WP_Widget_Search');
    unregister_widget('WP_Widget_Recent_Comments');
}

$widgets = array(
	'sticky',
	'statistics',
	'ads',
	'textads',
	'comments',
	'posts',
	'readers',
	'tags'
);

foreach ($widgets as $widget) {
	include 'widget-'.$widget.'.php';
}


add_action( 'widgets_init', 'widget_ui_loader' );
function widget_ui_loader() {
	global $widgets;
	foreach ($widgets as $widget) {
		register_widget( 'widget_ui_'.$widget );
	}
}