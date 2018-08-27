package com.lzp.util;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class WechatXmlUtil
{
    private static Logger logger = Logger.getLogger("WechatXmlUtil");

    public static byte[] readInput(InputStream in)
            throws IOException
    {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int len = 0;
        byte[] buffer = new byte[1024];
        while ((len = in.read(buffer)) > 0) {
            out.write(buffer, 0, len);
        }
        out.close();
        in.close();
        return out.toByteArray();
    }

    public static String inputStreamToString(InputStream is)
            throws IOException
    {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        int i;
        while ((i = is.read()) != -1)
        {
            baos.write(i);
        }
        return baos.toString();
    }

    public static InputStream getStringStream(String sInputString)
    {
        ByteArrayInputStream tInputStringStream = null;
        if ((sInputString != null) && (!sInputString.trim().equals(""))) {
            tInputStringStream = new ByteArrayInputStream(sInputString.getBytes());
        }
        return tInputStringStream;
    }

    public static String getStringFromMap(Map<String, Object> map, String key, String defaultValue)
    {
        if ((key == "") || (key == null)) {
            return defaultValue;
        }
        String result = (String)map.get(key);
        if (result == null) {
            return defaultValue;
        }
        return result;
    }

    public static int getIntFromMap(Map<String, Object> map, String key)
    {
        if ((key == "") || (key == null)) {
            return 0;
        }
        if (map.get(key) == null) {
            return 0;
        }
        return Integer.parseInt((String)map.get(key));
    }

    public static String log(Object log)
    {
        logger.info(log.toString());
        return log.toString();
    }

    public static String getLocalXMLString(String localPath)
            throws IOException
    {
        return inputStreamToString(WechatXmlUtil.class.getResourceAsStream(localPath));
    }

    public static Map<String, String> parseToMap(InputStream is)
    {
        try
        {
            String str = inputStreamToString(is);
            if ((str == null) || (str.trim().length() == 0)) {
                return null;
            }
            return getMapFromXML(str);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return null;
    }

    public static Map<String, String> getMapFromXML(String xmlString)
            throws ParserConfigurationException, IOException, SAXException
    {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        InputStream is = getStringStream(xmlString);
        Document document = builder.parse(is);

        NodeList allNodes = document.getFirstChild().getChildNodes();

        Map<String, String> map = new HashMap();
        int i = 0;
        while (i < allNodes.getLength())
        {
            Node node = allNodes.item(i);
            if ((node instanceof Element)) {
                map.put(node.getNodeName(), node.getTextContent());
            }
            i++;
        }
        return map;
    }
}