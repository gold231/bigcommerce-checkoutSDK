import _ from 'lodash';

export default {
  priceWithoutTax: _.template(`
    <% if (price.rrp_without_tax) { %>
      <div class="price-rrp-wrapper">
        <label class="price-rrp-label"><%= retailPriceLabel %></label>
        <span class="price-rrp"><%= price.rrp_without_tax.formatted %></span>
      </div>
    <% } %>
    <% if (price.non_sale_price_without_tax) { %>
      <div class="price-ns-wrapper">
        <label class="price-ns-label"><%= nonSalePriceLabel %></label>
        <span class="price-ns">
          <%= price.non_sale_price_without_tax.formatted %>
        </span>
      </div>
    <% } %>
    <div class="price-value-wrapper">
      <!-- If there's another price show "now" label -->
      <% if (price.non_sale_price_without_tax) { %>
        <label class="price-value-label"><%= salePriceLabel %></label>
      <% } else { %>
        <label class="price-label"><%= priceLabel %></label>
      <% } %>
      <span class="price-value" data-product-price>
        <%= price.without_tax.formatted %>
      </span>
      <% if (price.with_tax && price.without_tax) { %>
        <span class="price-tax-label"><%= excludingTax %></span>
      <% } %>
    </div>
  `),

  priceWithTax: _.template(`
    <% if (price.rrp_with_tax) { %>
      <div class="price-rrp-wrapper">
        <label class="price-rrp-label"><%= retailPriceLabel %></label>
        <span class="price-rrp"><%= price.rrp_with_tax.formatted %></span>
      </div>
    <% } %>
    <% if (price.non_sale_price_without_tax) { %>
      <div class="price-ns-wrapper">
        <label class="price-ns-label"><%= nonSalePriceLabel %></label>
        <span class="price-ns">
          <%= price.non_sale_price_with_tax.formatted %>
        </span>
      </div>
    <% } %>
    <div class="price-value-wrapper">
      <!-- If there's another price show "now" label -->
      <% if (price.non_sale_price_with_tax) { %>
        <label class="price-value-label"><%= salePriceLabel %></label>
      <% } else { %>
        <label class="price-label"><%= priceLabel %></label>
      <% } %>
      <span class="price-value" data-product-price>
        <%= price.with_tax.formatted %>
      </span>
      <% if (price.with_tax && price.without_tax) { %>
        <span class="price-tax-label"><%= includingTax %></span>
      <% } %>
    </div>
  `),

  priceSaved: _.template(`
    <% if (price.saved) { %>
      (<%= savedString %> <%= price.saved.formatted %>)
    <% } %>
  `),

  optionImageMain: _.template(`
    <a
      class="product-image-slide"
      href="<%= original %>"
      data-image-position="<%= index %>"
      data-product-image
      data-product-image-variant
    >
      <img src="<%= large %>" alt="<%= alt %>">
    </a>
    >
  `),
};
