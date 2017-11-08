<?php 
if( !$_POST ){
    exit;
}

include 'load.php';

if( !_hui('user_page_s') ){
    exit;
}

if( !is_user_logged_in() ) {
	print_r(json_encode(array('error'=>1)));
	exit;
}

$ui = array();
foreach ($_POST as $key => $value) {
    $ui[$key] = esc_sql(trim($value));
}

if( empty($ui['action']) ){
    exit;
}

if( empty($ui['paged']) ){
	$ui['paged'] = 1;
}

$printr = array();

date_default_timezone_set('PRC');
$nowtime = date('Y-m-d G:i:s');
$timenull = '0000-00-00 00:00:00';

$caches = array();

// if( is_super_admin() ) $cuid = 14986;

switch ($ui['action']) {

    case 'post.new':

        if( !_hui('tougao_s') ){
            print_r(json_encode(array('error'=>1, 'msg'=>'站点未允许用户发布文章')));  
            exit();
        }

        // last time
        $last_post = $wpdb->get_var("SELECT post_date FROM $wpdb->posts WHERE post_author='{$cuid}' AND post_type = 'post' ORDER BY post_date DESC LIMIT 1");

        if ( time() - strtotime($last_post) < 120 ){
            print_r(json_encode(array('error'=>1, 'msg'=>'两次提交文章时间间隔太短，请稍候再来')));  
            exit();
        }

        $title   =  $ui['post_title'];
        $url     =  $ui['post_url'];
        $content =  $ui['post_content'];


        if ( empty($title) || mb_strlen($title) > 50 ) {
            print_r(json_encode(array('error'=>1, 'msg'=>'标题不能为空，且小于50个字符')));  
            exit();
        }

        if ( empty($content) || mb_strlen($content) > 10000 || mb_strlen($content) < 10 ) {
            print_r(json_encode(array('error'=>1, 'msg'=>'文章内容不能为空，且介于10-10000字之间')));  
            exit();
        }

        if ( !empty($url) && mb_strlen($url) > 200 ) {
            print_r(json_encode(array('error'=>1, 'msg'=>'来源链接不能大于200个字符')));  
            exit();
        }

        if( !empty($url) ){
            $content .= '<p>来源：<a href="'.$url.'" target="_blank">'.$url.'</a></p>';
        }


        // has post title
        $posttitle = $wpdb->get_var("SELECT post_title FROM $wpdb->posts WHERE post_author='{$cuid}' AND post_title = '{$title}' LIMIT 1");
        if( !empty($posttitle) ){
            print_r(json_encode(array('error'=>1, 'msg'=>'标题 '. $posttitle .' 已存在')));  
            exit();
        }


        // insert post data
        $in_data = array(
            'post_title'   => $title,
            'post_author'  => $cuid,
            'post_content' => $content
        );

        $in_id = wp_insert_post( $in_data );


        // fail
        if (!$in_id) { 
            print_r(json_encode(array('error'=>1, 'msg'=>'投稿失败，请稍后再试')));  
            exit();
        }


        // insert post meta 
        if( !empty($url) ){
           add_post_meta($in_id, 'fromurl_value', $url, true);
        }


        // mail message
        if( _hui('tougao_mail_send') ){
            wp_mail(_hui('tougao_mail_to'), '站长，有新投稿：'.$title, $content);
        }

        print_r(json_encode(array('error'=>0, 'msg'=>'投稿成功，站长审核中...')));  
        exit();
   

        break;
    case 'posts':
        $status_all = array('publish', 'draft', 'pending', 'trash', 'future');
        if( $ui['status'] == 'all' ){
            $post_status = $status_all;
        }else{
            if( !in_array($ui['status'], $status_all) ) die('a');
            $post_status = $ui['status'];
        }

        $args = array(
            'ignore_sticky_posts' => 1,
            'showposts' => 10,
            'paged' => $ui['paged'],
            'orderby' => 'date',
            'author' => $cuid,
            'post_status' => $post_status
        );
        query_posts($args);

        if( isset($ui['first']) ){
            $printr['menus'] = array(
                array('name' => 'all', 'title' => '全部', 'count' => u_post_count('all') ),
                array('name' => 'publish', 'title' => '已发布', 'count' => u_post_count('publish') ),
                array('name' => 'future', 'title' => '定时', 'count' => u_post_count('future') ),
                array('name' => 'pending', 'title' => '待审', 'count' => u_post_count('pending') ),
                array('name' => 'draft', 'title' => '草稿', 'count' => u_post_count('draft') ),
                array('name' => 'trash', 'title' => '回收站', 'count' => u_post_count('trash') )
            );
        }

        $count = u_post_count($ui['status']);

        if( str_is_int($ui['paged']) && $count && $ui['paged'] <= ceil($count/10) ){
            $printr['items'] = u_post_data();
            $printr['max'] = $count;
        }

        break;

	case 'info':
		$udata = get_userdata( $cuid );

		$printr['user'] = array(
			'regtime' => $udata->user_registered,
			'logname' => $udata->user_login,
			'nickname' => $udata->display_name,
			'email' => $udata->user_email,
			'url' => $udata->user_url,
			'qq' => get_user_meta( $cuid, 'qq', true ),
			'weixin' => get_user_meta( $cuid, 'weixin', true ),
			'weibo' => get_user_meta( $cuid, 'weibo', true )
		);

		break;
	case 'password.edit':
        if( !$ui['passwordold'] && !$ui['password'] && !$ui['password2'] ){
            print_r(json_encode(array('error'=>1, 'msg'=>'密码不能为空'))); 
            exit();
        }

        if( strlen($ui['password'])<6 ) {  
            print_r(json_encode(array('error'=>1, 'msg'=>'密码至少6位')));  
            exit();
        }

        if( $ui['password'] !== $ui['password2'] ) {  
            print_r(json_encode(array('error'=>1, 'msg'=>'两次密码输入不一致')));  
            exit();
        }

        if( $ui['passwordold'] == $ui['password'] ) {  
            print_r(json_encode(array('error'=>1, 'msg'=>'新密码和原密码不能相同')));  
            exit();
        }

        global $wp_hasher;
        require_once( ABSPATH.WPINC.'/class-phpass.php' );
        $wp_hasher = new PasswordHash(8, TRUE);

        if(!$wp_hasher->CheckPassword($ui['passwordold'], $current_user->user_pass)) {
            print_r(json_encode(array('error'=>1, 'msg'=>'原密码错误')));  
            exit(); 
        }

        // require_once( ABSPATH.WPINC.'/registration.php' );
        $status = wp_update_user( 
            array (
                'ID' => $cuid,
                'user_pass' => $ui['password']
            ) 
        );

        if( is_wp_error($status) ){
            print_r(json_encode(array('error'=>1, 'msg'=>'修改失败，请稍后再试')));  
            exit(); 
        }
        
        print_r(json_encode(array('error'=>0)));  
        exit(); 
        

        break;
	case 'info.edit':

        if( !$ui['nickname'] || ($ui['nickname'] && sstrlen($ui['nickname'])>12) || ($ui['nickname'] && sstrlen($ui['nickname'])<2) ) {  
            print_r(json_encode(array('error'=>1, 'msg'=>'昵称不能为空且限制在2-12字内')));  
            exit();  
        }

        /*if( !$ui['email'] ) {  
            print_r(json_encode(array('error'=>1, 'msg'=>'邮箱不能为空')));  
            exit();  
        }

        if( $ui['email'] && !preg_match("/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/", $ui['email']) ) {  
            print_r(json_encode(array('error'=>1, 'msg'=>'邮箱格式错误')));  
            exit();  
        }*/

        if( $ui['url'] && (!preg_match("/^((http|https)\:\/\/)([a-z0-9-]{1,}.)?[a-z0-9-]{2,}.([a-z0-9-]{1,}.)?[a-z0-9]{2,}$/", $ui['url']) || sstrlen($ui['url'])>100) ){
            print_r(json_encode(array('error'=>1, 'msg'=>'网址格式错误')));  
            exit(); 
        }

        if( $ui['weibo'] && (!preg_match("/^((http|https)\:\/\/)([a-z0-9-]{1,}.)?[a-z0-9-]{2,}.([a-z0-9-]{1,}.)?[a-z0-9]{2,}$/", $ui['weibo']) || sstrlen($ui['weibo'])>100) ){
            print_r(json_encode(array('error'=>1, 'msg'=>'微博格式错误')));  
            exit(); 
        }

        if( $ui['qq'] && !preg_match("/^[1-9]\d{4,13}$/", $ui['qq']) ){
            print_r(json_encode(array('error'=>1, 'msg'=>'QQ格式错误')));  
            exit(); 
        }

        if( $ui['weixin'] && sstrlen($ui['weixin'])>30 ) {  
            print_r(json_encode(array('error'=>1, 'msg'=>'微信字数过长，限制在30字内')));  
            exit();  
        }

        /*if( is_disable_username($ui['nickname']) ){
        // if( !current_user_can('edit_posts') && is_disable_username($ui['nickname']) ){
        	print_r(json_encode(array('error'=>1, 'msg'=>'昵称含保留或非法字符，换一个再试')));  
            exit();
        }*/

        /*$hasmail = $wpdb->get_var( "SELECT ID FROM wp_users WHERE user_email='{$ui["email"]}'" );
        if( $hasmail && (int)$hasmail !== $cuid ){
        	print_r(json_encode(array('error'=>1, 'msg'=>'邮箱已存在，换一个试试')));  
            exit();  
        }*/

        // if( $ui['nickname'] ) update_user_meta($cuid, 'nickname', $ui['nickname']);
        if( $ui['weibo'] ) update_user_meta($cuid, 'weibo', $ui['weibo']);
        if( $ui['weixin'] ) update_user_meta($cuid, 'weixin', $ui['weixin']);
        if( $ui['qq'] ) update_user_meta($cuid, 'qq', $ui['qq']);

        // require_once( ABSPATH.WPINC.'/registration.php' );
        $datas = array('ID' => $cuid);

        // if( $ui['email'] ) $datas['user_email'] = $ui['email'];
        if( $ui['url'] ) $datas['user_url'] = $ui['url'];
        if( $ui['nickname'] ) $datas['display_name'] = $ui['nickname'];
        // if( $ui['nickname'] ) $datas['user_login'] = $ui['nickname'];


        $status = wp_update_user( $datas ); 

        if( !$status || is_wp_error($status) ){
            print_r(json_encode(array('error'=>1, 'msg'=>'修改失败，请稍后再试')));  
            exit(); 
        }

        print_r(json_encode(array('error'=>0)));  
        exit(); 
        

        break;
	
	case 'comments':
	
		$count = u_comment_count();

		if( str_is_int($ui['paged']) && $count && $ui['paged'] <= ceil($count/10) ){
			$printr['items'] = u_comment_data($ui['paged']);
			$printr['max'] = $count;
		}

		break;
	
	default:
		# code...
		break;
}

print_r( json_encode($printr) );
exit;

function u_get_thumbnail_src() {  
    global $post;
    
    $content = _get_post_thumbnail();  
    preg_match_all('/<img.*?(?: |\\t|\\r|\\n)?src=[\'"]?(.+?)[\'"]?(?:(?: |\\t|\\r|\\n)+.*?)?>/sim', $content, $strResult, PREG_PATTERN_ORDER);  
    return $strResult[1][0];
}

function u_get_post_like_number(){
    global $post;
    $post_ID = $post->ID;
    return (int)get_post_meta( $post_ID, 'like', true );
}

function u_get_views(){
    global $post;
    $post_ID = $post->ID;
    return (int)get_post_meta($post_ID, 'views', true);
}

function u_post_data(){
    $items = array();
    while ( have_posts() ) : the_post(); 
        $cat = '';
        if( !is_category() ) {
            $category = get_the_category();
            if($category[0]){
                $cat = $category[0]->cat_name;
            }
        };

        $items[] = array(
            'thumb' => u_get_thumbnail_src(),
            'link' => get_permalink(),
            'title' => html_entity_decode(get_the_title()),
            'desc' => _get_excerpt(),
            'time' => get_the_time('Y-m-d G:i'),
            'cat' => $cat,
            'view' => u_get_views(),
            'comment' => (int)get_comments_number('0', '1', '%'),
            'like' => u_get_post_like_number(),
        );

    endwhile; 
    wp_reset_query();

    return $items;
}

function u_post_count( $poststatus ) {
    global $wpdb, $cuid;
    if( $poststatus == 'all' ){
        $count = $wpdb->get_var( "SELECT COUNT(1) FROM $wpdb->posts WHERE post_author={$cuid} AND post_type='post'" );
    }else{
        $count = $wpdb->get_var( "SELECT COUNT(1) FROM $wpdb->posts WHERE post_author={$cuid} AND post_type='post' AND post_status='{$poststatus}'" );
    }
    return (int)$count;
}


function str_is_int($str)   {
	return 0 === strcmp($str , (int)$str);
}

function u_comment_data($paged=1){
    $items = array();
    $args = array(
        'user_id' => get_current_user_id(),
        'number' => 10,
        'offset' => ($paged-1)*10
    );
    $comments = get_comments($args);
    foreach($comments as $comment){
        $items[] = array(
	    	'content' => $comment->comment_content,
	    	'post_link' => get_comment_link( $comment->comment_ID ),
	    	'post_title' => html_entity_decode(get_the_title( $comment->comment_post_ID )),
	    	'time' => $comment->comment_date
	    );
    }
    return $items;
}

function u_coupon_count() {
	global $wpdb, $cuid;
	$count = $wpdb->get_var( "SELECT COUNT(1) FROM hi_coupons WHERE user_id={$cuid}" );
  	return (int)$count;
}

function u_comment_count() {
	global $wpdb, $cuid;
	$count = $wpdb->get_var( "SELECT COUNT(1) FROM $wpdb->comments WHERE user_id={$cuid}" );
  	return (int)$count;
}