<?php 
/**
 * Template name: Navs
 * Description:   A site navigation page
 */

get_header();

?>

<?php 

$link_cat_ids = array();
if( _hui('navpage_cats') ){
	foreach (_hui('navpage_cats') as $key => $value) {
		if( $value ) $link_cat_ids[] = $key;
	}
}

$link_cat_ids = implode(',', $link_cat_ids);

?>

<div class="pageheader">
	<div class="container">
		<div class="share">
			<?php _moloader('mo_share', false); mo_share('renren'); ?>
		</div>
		<h1><?php the_title(); ?></h1>
		<div class="note"><?php echo _hui('navpage_desc') ? _hui('navpage_desc') : '这里显示的是网址导航的一句话描述...' ?></div>
	</div>
</div>

<section class="container" id="navs">
	<nav>
		<ul></ul>
	</nav>
	<div class="items">
		<?php 
			$html = wp_list_bookmarks(array(
				'category'         => $link_cat_ids,
				'echo'             => false,
				'show_description' => true,
				'between'          => '<br>',
				'title_li'         => __(''),
				'category_before'  => '<div class="item">',
				'category_after'   => '</div>'
			));
			if( !empty($html) ){
				echo $html;
			}else{
				echo '请在后台-链接中添加链接和链接分类用于展示在这里。';
			}
		?>
	</div>
</section>

<?php

get_footer();