<?php 
	get_header(); 
	$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
?>
<section class="container">
	<div class="content-wrap">
	<div class="content">
		<?php 
			if( $paged==1 && _hui('focusslide_s') ){ 
				_moloader('mo_slider', false);
				mo_slider('focusslide');
			} 
		?>
		<?php 
			$pagedtext = ''; 
			if( $paged > 1 ){
				$pagedtext = ' <small>第'.$paged.'页</small>';
			}
		?>
		<?php  
			if( _hui('minicat_home_s') ){
				_moloader('mo_minicat');
			}
		?>
		<?php _the_ads($name='ads_index_01', $class='asb-index asb-index-01') ?>
		<div class="title">
			<h3>
				<?php echo _hui('index_list_title') ? _hui('index_list_title') : '最新发布' ?>
				<?php echo $pagedtext ?>
			</h3>
			<?php 
				if( _hui('index_list_title_r') ){
					echo '<div class="more">'._hui('index_list_title_r').'</div>';
				} 
			?>
		</div>
		<?php  
			$args = array(
			    'ignore_sticky_posts' => 1,
			    'paged' => $paged
			);

			if( _hui('notinhome') ){
				$pool = array();
				foreach (_hui('notinhome') as $key => $value) {
					if( $value ) $pool[] = $key;
				}
				$args['cat'] = '-'.implode($pool, ',-');
			}

			if( _hui('notinhome_post') ){
				$pool = _hui('notinhome_post');
				$args['post__not_in'] = explode("\n", $pool);
			}

			query_posts($args);
		?> 
		<?php get_template_part( 'excerpt' ); ?>
		<?php _the_ads($name='ads_index_02', $class='asb-index asb-index-02') ?>
	</div>
	</div>
	<?php get_sidebar(); ?>
</section>
<?php get_footer();