<?php 
/**
 * Template name: Archives
 * Description:   A archives page
 */

get_header();

?>

<div class="container container-page">
	<?php _moloader('mo_pagemenu', false) ?>
	<div class="content">
		<?php while (have_posts()) : the_post(); ?>
		<header class="article-header">
			<h1 class="article-title"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></h1>
		</header>
		<article class="article-content">
			<?php the_content(); ?>
		</article>
		<?php endwhile;  ?>

		<article class="archives">
            <?php
            $previous_year = $year = 0;
            $previous_month = $month = 0;
            $ul_open = false;

            $myposts = get_posts('numberposts=-1&orderby=post_date&order=DESC');
            
            foreach($myposts as $post) :
                setup_postdata($post);
             
                $year = mysql2date('Y', $post->post_date);
                $month = mysql2date('n', $post->post_date);
                $day = mysql2date('j', $post->post_date);
                
                if($year != $previous_year || $month != $previous_month) :
                    if($ul_open == true) : 
                        echo '</ul></div>';
                    endif;
             
                    echo '<div class="item"><h3>'; echo the_time('F Y'); echo '</h3>';
                    echo '<ul class="archives-list">';
                    $ul_open = true;
             
                endif;
             
                $previous_year = $year; $previous_month = $month;


               /* $post_data = get_post($post->ID, ARRAY_A);
                $slug = $post_data['post_name'];*/

            ?>
                <li>
                    <time><?php the_time('j'); ?>日</time>
                    <a href="<?php the_permalink(); ?>"><?php the_title(); ?> </a>
                    <span class="text-muted"><?php comments_number('', '1评论', '%评论'); ?></span>
                </li>
            <?php endforeach; ?>
            </ul>
        </div>
        </article>

		<?php //comments_template('', true); ?>
	</div>
</div>


<?php

get_footer();