<?php
/**
 * Bootstap file for DEFAULT
 *
 * @author  Leandro Rizzo leandro.php@terra.com.br
 * @version $Id: index.php 4 2015-01-15 12:00:00Z $
 */
// Set the application root path
define('PATH_ROOT', realpath(dirname(__FILE__) . '/library'));
error_reporting(E_ALL & ~E_NOTICE);
//error_reporting(0);

//
ini_set('display_errors', '1');
ini_set('session.auto_start', '0');

//
ini_set('date.timezone', 'America/Sao_Paulo');

//echo date('Y-m-d H:i:s');

// Set include path
set_include_path(PATH_ROOT . PATH_SEPARATOR
. realpath(dirname(__FILE__) . '/app/modules/home/views/scripts'). PATH_SEPARATOR
. realpath(dirname(__FILE__) . '/app/modules/api/views/scripts'). PATH_SEPARATOR
. realpath(dirname(__FILE__) . '/app/models'). PATH_SEPARATOR
. realpath(dirname(__FILE__) . ''). PATH_SEPARATOR
. get_include_path());

// Load required files
require_once 'library/Zend/Controller/Front.php';
require_once 'library/Zend/Config/Ini.php';
require_once 'library/Zend/Registry.php';
require_once 'library/Zend/Session/Namespace.php';
require_once 'library/Zend/Loader/Autoloader.php';
require_once 'library/Zend/Loader.php';

//
$production = 'test';
//$production = 'homolog';
//$production = 'production';
Zend_Registry::set('production', $production);

// Load Configuration
$config = new Zend_Config_Ini('config/configIniFile.ini', 'default', true);
$dbConfig = new Zend_Config_Ini('config/configIniFile.ini', $production, true);

$config->merge($dbConfig);
Zend_Registry::set('config', $config);

// Start Session
$session = new Zend_Session_Namespace('#$%ZIGZAG#');
Zend_Registry::set('session', $session);

// Set up the DB controller
Zend_Loader_Autoloader::getInstance();
Zend_Loader::loadClass('Zend_Db');
Zend_Loader::loadClass('Zend_Db_Table');
Zend_Loader::loadClass('Zend_Filter_StripTags');
Zend_Loader::loadClass('Zend_Debug');

Zend_Session::start();

$db = Zend_Db::factory($config->db->adapter,
$config->db->config->toArray());
Zend_Db_Table::setDefaultAdapter($db);
Zend_Registry::set('db', $db);

//load controller front
Zend_Loader::loadClass('Zend_Controller_Front');

$front = Zend_Controller_Front::getInstance();

$router =   $front->getRouter();

$route = new Zend_Controller_Router_Route(
		':controller/:action/*',
		array(
				'module' 		=> 'home',
				'controller' 	=> 'index',
				'action' 		=> 'index'
		)
);
$router->addRoute('default', $route);

// MODULO SISTEMA - NAICHE
$route = new Zend_Controller_Router_Route(
	'api/:controller/:action/*',
	array(
		'module' 		=> 'api',
		'controller' 	=> 'index',
		'action' 		=> 'index'
	)
);
$router->addRoute('api', $route);

// MODULO SISTEMA - NAICHE
$route = new Zend_Controller_Router_Route(
	'naichesms/:controller/:action/*',
	array(
		'module' 		=> 'naichesms',
		'controller' 	=> 'index',
		'action' 		=> 'index'
	)
);
$router->addRoute('naichesms', $route);

//adding modules
$front->setControllerDirectory(array(
		'home'		=> './app/modules/home/controllers',
		'api'		=> './app/modules/api/controllers',
		'naichesms' => './app/modules/naichesms/controllers',
));
$front->setDefaultModule('home');

//adding a router
$front->throwExceptions(false);
$front->setBaseUrl($config->www->baseurl);
//run!
$front->dispatch();