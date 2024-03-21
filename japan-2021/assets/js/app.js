const applicationKey = '5c479e9b6dc1a5126e9dc1725c4fde702435d9b72ee1065b12354a7106013675';
const clientKey = '6b7a74ec589adfbf49249259d2f664e62e7c581f712f9dc3c33dbcf6744fec5f';
const ncmb = new NCMB(applicationKey, clientKey);

jQuery(() => {
  jQuery('.hide').hide();
  jQuery('.cfp').on('submit', async (e) => {
    jQuery('.alert_box').hide();
    e.preventDefault();
    const text = jQuery('.submit-button').text();
    jQuery('.submit-button')
      .text('送信中…')
      .attr('disabled', true);
    try {
      const ary = jQuery(e.target).serializeArray();
      const proposal = new (ncmb.DataStore('Proposal'));
      for (const key of ary) {
        proposal.set(key.name, key.value);
      }
      await proposal.save();
      await ncmb.Script
        .data({objectId: proposal.objectId})
        .exec('POST', 'mail.js');
      jQuery('.alert_box.success').show();
    } catch (e) {
      jQuery('.alert_box.error').show();
    }
    jQuery('.submit-button').text(text).attr('disabled', false);
    // jQuery('.quform-loading-wrap').hide();
    jQuery('form.cfp .remove').val('');
    saveLocalStorage();
  });

  const saveLocalStorage = () => {
    const form = jQuery('form.cfp').serializeArray();
    localStorage.setItem('cfp', JSON.stringify(form));
  }

  jQuery('form.cfp input,form.cfp textarea').on('keyup', saveLocalStorage);

  const value = localStorage.getItem('cfp');
  if (location.pathname.match(/\/cfp/) && value) {
    const json = JSON.parse(value);
    for (const key of json) {
      jQuery(`.cfp [name="${key.name}"]`).val(key.value);
    }
  }
});