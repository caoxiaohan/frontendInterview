<?php
/**
 * Used for index/archive/search/author/catgory/tag.
 *
 */
$ii = 0;
while ( have_posts() ) : the_post(); 

    $_thumb = _get_post_thumbnail();

    $_excerpt_text = '';
    if( _hui('list_type')=='text' || (_hui('list_type') == 'thumb_if_has' && strstr($_thumb, 'data-thumb="default"')) ){
        $_excerpt_text = ' excerpt-text';
    }

    $ii++;
    echo '<article class="excerpt excerpt-'.$ii. $_excerpt_text .'">';

        if( _hui('list_type') == 'thumb' ){
            echo '<a'._post_target_blank().' class="focus" href="'.get_permalink().'">'.$_thumb.'</a>';
        }else if( _hui('list_type') == 'thumb_if_has' && !strstr($_thumb, 'data-thumb="default"') ){
            echo '<a'._post_target_blank().' class="focus" href="'.get_permalink().'">'.$_thumb.'</a>';
        }

        echo '<header>';
            if( _hui('post_plugin_cat') && !is_category() ) {
                $category = get_the_category();
                if($category[0]){
                    echo '<a class="cat" href="'.get_category_link($category[0]->term_id ).'">'.$category[0]->cat_name.'<i></i></a> ';
                }
            };
            echo '<h2><a'._post_target_blank().' href="'.get_permalink().'" title="'.get_the_title().get_the_subtitle(false)._get_delimiter().get_bloginfo('name').'">'.get_the_title().get_the_subtitle().'</a></h2>';
        echo '</header>';
        echo '<p class="meta">';

        if( _hui('post_plugin_date') ){
            echo '<time><i class="fa fa-clock-o"></i>'.get_the_time('Y-m-d').'</time>';
        }

        if( _hui('post_plugin_author') ){
            $author = get_the_author();
            if( _hui('author_link') ){
                $author = '<a href="'.get_author_posts_url( get_the_author_meta( 'ID' ) ).'">'.$author.'</a>';
            }
            echo '<span class="author"><i class="fa fa-user"></i>'.$author.'</span>';
        }

        if( _hui('post_plugin_view') ){
            echo '<span class="pv"><i class="fa fa-eye"></i>'._get_post_views().'</span>';
        }

        if ( comments_open() && _hui('post_plugin_comm') ) {
            echo '<a class="pc" href="'.get_comments_link().'"><i class="fa fa-comments-o"></i>评论('.get_comments_number('0', '1', '%').')</a>';
        }


        echo '</p>';
        echo '<p class="note">'._get_excerpt().'</p>';
        if( _hui('post_link_excerpt_s') ) _moloader('mo_post_link');
    echo '</article>';

endwhile; 

_moloader('mo_paging');

wp_reset_query();