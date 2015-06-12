<?php

require_once __DIR__.'/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ParameterBag;

$app = new Silex\Application();
if ($_SERVER['REMOTE_ADDR'] === '127.0.0.1') {
    $app['debug'] = true;
}

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../src/views',
));

//$app->register(new Silex\Provider\SwiftmailerServiceProvider());
//$app['swiftmailer.options'] = array(
//    'host' => $config['mailer_host'],
//    'port' => $config['mailer_port'],
//    'username' => $config['mailer_user'],
//    'password' => $config['mailer_pass'],
//);

// only parse the content of the request if JSON and then replace the request data on the $request object:
$app->before(function (Request $request) {
    if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
        $data = json_decode($request->getContent(), true);
        $request->request->replace(is_array($data) ? $data : array());
    }
});

// Filter the response to remove whitespace
$app->after(function(Request $request, Response $response) {
    $content = $response->getContent();
    $content = trim(preg_replace('/\s+/i', ' ', $content));
    $content = preg_replace('/<!--.+?-->/', '', $content);
    $response->setContent($content);
});

//// json api GET for react
//$app->get('/api/react-data', function (Request $request) use ($app) {
//    return new Response(file_get_contents('reactData.json'), 200, array('Content-Type' => 'application/json'));
//});
//
//// json api POST for react
//$app->post('/api/react-data', function (Request $request) use ($app) {
//    $post = array(
//        'author' => $request->request->get('author'),
//        'test'  => $request->request->get('test'),
//    );
////    $post['id'] = createPost($post);
//    return $app->json($post, 201);
//});

$app->match('/api/react-data', function(Request $request) use ($app) {
    if ($request->getMethod() === 'GET') {
        return new Response(file_get_contents('reactData.json'), 200, array('Content-Type' => 'application/json'));
    } elseif ($request->getMethod() === 'POST') {
        $comment = array(
            'author' => $request->request->get('author'),
            'text'  => $request->request->get('text'),
        );

        $reactData = file_get_contents("reactData.json");
        $data = json_decode($reactData, true);
        array_push($data, $comment);
        file_put_contents('reactData.json', json_encode($data));
        return $app->json($comment, 201);
    }
})
->method('GET|POST');

// Other routes
$app->get('/{name}', function($name) use ($app) {
    return $app['twig']->render(str_replace('-', '_', $name) . '.html.twig', array(
        'page_name' => $name,
    ));
})
->assert('name', '(web|css3|react)')
->value('name', 'home');

//$app->match('/contact', function(Request $request) use ($app) {
//    $sent = false;
//    if ($request->getMethod() === 'POST') {
//        $post =  $request->request->all();
//        $body = sprintf("Type: %s\nFrom: %s (%s)\nSent: %s\nIP: %s\n\n%s",
//            $post['type'], $post['name'], $post['email'], date('Y-m-d H:i:s'),
//            $request->getClientIp(), $post['message']);
//        $message = \Swift_Message::newInstance()
//            ->setSubject('Contact: ' . $post['subject'])
//            ->setFrom(array($post['email'] => $post['name']))
//            ->setTo('contact@domain.com')
//            ->setBody($body);
//
//        $app['mailer']->send($message);
//        $sent = true;
//    }
//
//    return $app['twig']->render('contact.html.twig', array(
//        'sent' => $sent,
//        'type' => $request->query->has('type') ? $request->query->get('type') : null,
//        'page_name' => 'contact',
//    ));
//})
//->method('GET|POST');

$app->run();