using System;

namespace VIMajorPCR
{
    public partial class Home : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                wcIDInput.Value = (Request.QueryString["wcid"] != null) ? Request.QueryString["wcid"].ToString() : "";
                wcNameInput.Value = (Request.QueryString["wcname"] != null) ? Request.QueryString["wcname"].ToString() : "";
            }
            catch (Exception ex)
            {

            }
        }
    }
}