<?php
include_once 'library/Zend/Db/Table/Row/Abstract.php';

abstract class db extends Zend_Db_Adapter_Abstract
{}

class lista_contatos extends Zend_Db_Table_Abstract
{
    protected $_name = 'zz_lista_contatos';
    protected $_primary = 'id_lista';
}
class aceites_navega extends Zend_Db_Table_Abstract
{
    protected $_name = 'zz_aceites_navega';
    protected $_primary = 'id_navegacao';
}
class contato extends Zend_Db_Table_Abstract
{
	protected $_name = 'zz_contato';
	protected $_primary = 'id_contato';
}

class contatos extends Zend_Db_Table_Abstract
{
	protected $_name = 'zz_contatos';
	protected $_primary = 'id_contato';
}

class contato_campanha extends Zend_Db_Table_Abstract
{
	protected $_name = 'zz_contato_campanha';
	protected $_primary = 'id_contato_campanha';
}

class sms_enviados extends Zend_Db_Table_Abstract
{
	protected $_name = 'zz_sms_enviados';
	protected $_primary = 'id_sms_enviado';
}
class sms_enviados_control extends Zend_Db_Table_Abstract
{
    protected $_name = 'zz_sms_enviados_control';
    protected $_primary = 'id_sms_enviado';
}
class sms_erros extends Zend_Db_Table_Abstract
{
	protected $_name = 'zz_sms_erros';
	protected $_primary = 'id_erro';
}
class sms_aberto extends Zend_Db_Table_Abstract
{
	protected $_name = 'zz_sms_aberto';
	protected $_primary = 'id_sms_aberto';
}
class sms_caixa_entrada extends Zend_Db_Table_Abstract
{
	protected $_name = 'zz_sms_caixa_entrada';
	protected $_primary = 'id_sms_caixa_entrada';
}
class notificacoes extends Zend_Db_Table_Abstract
{
	protected $_name = 'zz_notificacoes';
	protected $_primary = 'id_notificacao';
}
class callback extends Zend_Db_Table_Abstract
{
	protected $_name = 'zz_callback_sms';
	protected $_primary = 'id_callback';
}
class caixa_entrada extends Zend_Db_Table_Abstract
{
	protected $_name = 'zz_caixa_entrada';
	protected $_primary = 'id_caixa_entrada';
}
class campanhas_visu extends Zend_Db_Table_Abstract
{
	protected $_name = 'zz_campanhas_visu';
	protected $_primary = 'id_visualizacao';
}
class notificacoes_lido extends Zend_Db_Table_Abstract
{
	protected $_name = 'zz_notificacoes_lido';
	protected $_primary = 'id_notificacao_lido';
}
class callback_tww extends Zend_Db_Table_Abstract
{
	protected $_name = 'zz_callback_tww';
	protected $_primary = 'id_callback';
}
class callback_tww_mo extends Zend_Db_Table_Abstract
{
	protected $_name = 'zz_callback_tww_mo';
	protected $_primary = 'id_mo';
}
class recibos_mo extends Zend_Db_Table_Abstract
{
    protected $_name = 'zz_recibos_mo';
    protected $_primary = 'id_mo';
}
class templates_click extends Zend_Db_Table_Abstract
{
    protected $_name = 'zz_templates_click';
    protected $_primary = 'id_click';
}