<?php get_header(); ?>

<section class="container">
	<div class="content-wrap">
	<div class="content">
		<?php _the_ads($name='ads_tag_01', $class='asb-tag asb-tag-01') ?>
		<?php 
		$pagedtext = '';
		if( $paged && $paged > 1 ){
			$pagedtext = ' <small>第'.$paged.'页</small>';
		}

		echo '<div class="pagetitle"><h1>标签：', single_tag_title(), '</h1>'.$pagedtext.'</div>';
		
		get_template_part( 'excerpt' );
		?>
	</div><!--本DUX2.0主题由日了狗www.rledog.com免费分享提供-->
	</div><!--本DUX2.0主题由日了狗www.rledog.com免费分享提供-->
	<?php get_sidebar(); ?>
</section>

<?php get_footer(); ?>