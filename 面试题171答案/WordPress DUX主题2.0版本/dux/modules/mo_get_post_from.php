<?php
/**
 * [mo_get_post_from description]
 * @param  string $pid      [description]
 * @param  string $prevtext [description]
 * @return [type]           [description]
 */
function mo_get_post_from($pid='', $prevtext='来源：'){
    if( !_hui('post_from_s') ){
        return;
    }

    if( !$pid ){
        $pid = get_the_ID();
    }

    $fromname = trim(get_post_meta($pid, "fromname_value", true));
    $fromurl = trim(get_post_meta($pid, "fromurl_value", true));
    $from = '';
    
    if( $fromname ){
        if( $fromurl && _hui('post_from_link_s') ){
            $from = '<a href="'.$fromurl.'" target="_blank" rel="external nofollow">'.$fromname.'</a>';
        }else{
            $from = $fromname;
        }
        $from = (_hui('post_from_h1')?_hui('post_from_h1'):$prevtext).$from;
    }

    return $from; 
}