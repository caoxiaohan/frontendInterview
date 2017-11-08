<?php 
get_header(); 
$pagedtext = '';
if( $paged && $paged > 1 ){
	$pagedtext = ' <small>第'.$paged.'页</small>';
}
?>
<section class="container">
	<div class="content-wrap">
	<div class="content">
		<div class="pagetitle"><h1><?php 
			if(is_day()) echo the_time('Y年m月j日');
			elseif(is_month()) echo the_time('Y年m月');
			elseif(is_year()) echo the_time('Y年'); 
		?>的文章</h1><?php echo $pagedtext ?></div>
		<?php get_template_part( 'excerpt' ); ?>
	</div>
	</div>
	<?php get_sidebar(); ?>
</section>

<?php get_footer(); ?>