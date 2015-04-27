<?php

require_once __DIR__.'/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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

// Filter the response to remove whitespace
$app->after(function(Request $request, Response $response) {
    $content = $response->getContent();
    $content = trim(preg_replace('/\s+/i', ' ', $content));
    $content = preg_replace('/<!--.+?-->/', '', $content);
    $response->setContent($content);
});


// Routes
$app->get('/{name}', function($name) use ($app) {
    return $app['twig']->render(str_replace('-', '_', $name) . '.html.twig', array(
        'page_name' => $name,
    ));
})
->assert('name', '(web|css3)')
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